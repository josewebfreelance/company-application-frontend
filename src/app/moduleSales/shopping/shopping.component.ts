import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {NitValidator} from '../../shared/validators/nit.validator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ClientsService} from '../../moduleOperations/services/clients.service';
import {SalesService} from '../services/sales.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from 'angular2-notifications';
import {ProductsService} from '../../moduleOperations/services/products.service';
import {DialogAddShoppingComponent} from './dialog-add-shopping/dialog-add-shopping.component';
import {ProvidersService} from '../../moduleOperations/services/providers.service';
import {ShoppingService} from '../services/shopping.service';

export interface User {
  nit: string;
  name: string;
}

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ProductsService]
})
export class ShoppingComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

  form: FormGroup;
  options: User[] = [
    {nit: '67860087', name: 'Jose Lemus'},
    {nit: '234567', name: 'Shelley'},
    {nit: '456789', name: 'Igor'}
  ];
  listProvidersComplete: any[] = [];
  listProvidersFilter: any[] = [];
  productsList: any[] = [];
  filteredOptions: Observable<User[]>;

  dataSource: any[] = [];
  displayedColumns: string[] = ['no', 'quantity', 'description', 'value', 'subTotal', 'actions'];

  entityProvider: any = {};
  entityShopping: any = {};
  countTotal = 0;
  entityLoad = true;

  constructor(
    private dateAdapter: DateAdapter<any>,
    public dialog: MatDialog,
    private salesService: SalesService,
    private shoppingService: ShoppingService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private notifications: NotificationsService,
    private productsService: ProductsService,
    private providersService: ProvidersService
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');
    this.route.params.subscribe((params: any) => {
      if (params) {
        if (params.id) {
          this.entityShopping.idCompra = params.id;
        }
      }

      this.form = new FormGroup({
        provider: new FormControl(null, [Validators.required]),
        name: new FormControl(null, [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        idClient: new FormControl(null)
      });

      this.queryProvidersComplete();
      this.queryProducts();
      this.findSale();
    });

    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.new) {
          this.openAdd();
        }
      }
    });

    this.filteredOptions = this.form.get('provider').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nit || value.proveedor),
        map(nit => nit ? this._filter(nit) : this.listProvidersComplete.slice())
      );
  }

  loadAll(): void {
    this.shoppingService.queryDetailSale(this.entityShopping.idCompra).subscribe(response => {
      if (response && response.length > 0) {
        this.dataSource = response;
      } else {
        this.dataSource = [];
      }
      this.calculateTotal();
    });
  }

  endSale(): void {
    this.entityShopping.estadoCompra = 2;
    this.entityShopping.idCompra = +this.entityShopping.idCompra;
    this.shoppingService.update(this.entityShopping).subscribe(response => {
      this.notifications.success('Correcto', 'La compra se finalizó correctamente.');
      this.findSale();
    }, error => {
      this.notifications.error('Error', error);
    });
  }

  findSale(): void {
    this.entityLoad = false;
    if (this.entityShopping.idCompra) {
      this.shoppingService.find(this.entityShopping.idCompra).subscribe(response => {
        if (response) {
          this.entityShopping = response;
          this.entityLoad = true;
          if (this.entityShopping.estadoCompra === 2 || this.entityShopping.estadoCompra === 3) {
            this.form.disable();
          } else {
            this.form.enable();
          }

          if (response.idProveedor) {
            this.productsService.find(response.idProveedor).subscribe(clientResponse => {
              if (clientResponse) {
                const res = new Date(response.fecha_orden);
                res.setDate(res.getDate() + 1);

                this.providersService.find(response.idProveedor).subscribe(responseProvider => {
                  console.log('prov', responseProvider);
                  this.form.get('provider').setValue(responseProvider.nit ? responseProvider.nit : '');
                  this.form.get('name').setValue(responseProvider.proveedor ? responseProvider.proveedor : '');
                });
                this.form.get('date').setValue(res);

                this.loadAll();
              }
            });
          }
        } else {
          this.entityLoad = false;
        }
      }, error => {
        this.entityLoad = false;
      });
    }
  }

  queryProvidersComplete(): void {
    this.providersService.query().subscribe(response => {
      if (response && response.length > 0) {
        response.forEach(item => {
          const tempObj = {
            direccion: item.direccion,
            idProveedor: item.idProveedor,
            nit: item.nit,
            proveedor: item.proveedor,
            telefono: item.telefono
          };
          this.listProvidersComplete.push(tempObj);
          this.listProvidersFilter.push(tempObj);
        });
      }
    });
  }

  queryProducts(): void {
    this.productsService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.productsList = response;
      }
    });
  }

  displayFn(value: string): string {
    return value ? value : '';
  }

  createSale(): void {
    const provider = this.form.get('provider').value;
    const find = this.listProvidersFilter.find(item => item.nit === provider);

    if (find !== undefined) {
      this.entityShopping.idProveedor = find.idProveedor;
    }

    this.entityShopping.no_orden_compra = 1;
    this.entityShopping.fecha_orden = this.form.get('date').value;
    this.entityShopping.estadoCompra = 1;

    this.shoppingService.create(this.entityShopping).subscribe(response => {
      this.router.navigate([`sales/shopping/${response.no_orden_compra}`], {
        queryParams: {new: true}
      }).then();
    });
  }

  openAdd(): void {
    if (!this.entityShopping.no_orden_compra) {
      if (this.form.valid) {
        const providerValue = this.form.get('provider').value;
        const findProvider = this.listProvidersComplete.find(item => item.nit === providerValue);

        console.log(findProvider);
        if (findProvider === undefined) {
          this.entityProvider.proveedor = this.form.get('name').value;
          this.entityProvider.nit = this.form.get('provider').value;
          this.entityProvider.direccion = null;
          this.entityProvider.telefono = null;

          this.providersService.create(this.entityProvider).subscribe(response => {
            console.log(response);
            if (response) {
              this.entityShopping.idProveedor = response.idProveedor;
              this.createSale();
            }
          });
        } else {
          this.entityShopping.idProveedor = findProvider.idProveedor;
          this.createSale();
        }
      }
    } else {
      const config: MatDialogConfig = {
        width: '40vw',
        disableClose: true,
        data: {
          idCompra: this.entityShopping.idCompra
        }
      };

      const dialog = this.dialog.open(DialogAddShoppingComponent, config);
      dialog.afterClosed().subscribe(response => {
        console.log(response)
        if (response && response.idCompra) {
          this.loadAll();
        }
      });
    }
  }

  deleteDetail(item): void {
    const response = this.matDialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {}
    });

    response.afterClosed().subscribe(
      (data: boolean) => {
        if (data === true) {
          this.shoppingService.delete(item.idVenta_detalle).subscribe(
            () => {
              this.notifications.success('Correcto', 'La acción se realizó con éxito.');
              this.loadAll();
            },
            (error: HttpErrorResponse) => {
              this.notifications.error('Error', error);
            }
          );
        }
      }
    );
  }

  calculateTotal(): void {
    this.dataSource.forEach(item => {
      this.countTotal += (+item.cantidad * item.precio_costo_unitario);
    });

    if (this.dataSource.length === 0) {
      this.countTotal = 0;
    }
  }

  addItem(): void {
    this.router.navigate([`sales/shopping`]).then();
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();

    const found = this.listProvidersComplete.filter(option => (option.nit.toLowerCase().indexOf(filterValue) === 0 || option.proveedor.toLowerCase().indexOf(filterValue) === 0));
    if (found.length > 0) {
      this.form.get('name').setValue(`${found[0].proveedor}`);
    } else {
      this.form.get('name').setValue(null);
    }

    return found;
  }

}
