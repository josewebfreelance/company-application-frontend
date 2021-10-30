import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {NitValidator} from '../../shared/validators/nit.validator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogAddSaleComponent} from './dialog-add-sale/dialog-add-sale.component';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ClientsService} from '../../moduleOperations/services/clients.service';
import {SalesService} from '../services/sales.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from 'angular2-notifications';
import {ProductsService} from '../../moduleOperations/services/products.service';

export interface User {
  nit: string;
  name: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ProductsService]
})
export class SalesComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

  form: FormGroup;
  options: User[] = [
    {nit: '67860087', name: 'Jose Lemus'},
    {nit: '234567', name: 'Shelley'},
    {nit: '456789', name: 'Igor'}
  ];
  listClients: any[] = [];
  productsList: any[] = [];
  filteredOptions: Observable<User[]>;

  dataSource: any[] = [];
  displayedColumns: string[] = ['no', 'quantity', 'description', 'value', 'subTotal', 'actions'];

  entityClient: any = {};
  entitySale: any = {};
  countTotal = 0;

  constructor(
    private dateAdapter: DateAdapter<any>,
    public dialog: MatDialog,
    private clientService: ClientsService,
    private salesService: SalesService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private notifications: NotificationsService,
    private productsService: ProductsService
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');
    this.route.params.subscribe((params: any) => {
      if (params) {
        if (params.sale) {
          this.entitySale.idVenta = params.sale;
        }
      }

      this.form = new FormGroup({
        nit: new FormControl(null, [NitValidator.verifyNIT(false, true)]),
        name: new FormControl(null, [Validators.required]),
        address: new FormControl('Ciudad', [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        idClient: new FormControl(null)
      });

      this.queryClients();
      this.queryProducts();
      this.findSale();
    });

    this.filteredOptions = this.form.get('nit').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nit),
        map(nit => nit ? this._filter(nit) : this.listClients.slice())
      );
  }

  loadAll(): void {
    this.salesService.queryDetailSale(this.entitySale.idVenta).subscribe(response => {
      if (response && response.length > 0) {
        this.dataSource = response;
        this.calculateTotal();
      } else {
        this.dataSource = [];
      }
    });
  }

  findSale(): void {
    if (this.entitySale.idVenta) {
      this.salesService.find(this.entitySale.idVenta).subscribe(response => {
        if (response) {
          if (response.idCliente) {
            this.clientService.find(response.idCliente).subscribe(clientResponse => {
              if (clientResponse) {
                const res = new Date(response.fechafactura);
                res.setDate(res.getDate() + 1);

                this.form.get('nit').setValue(clientResponse.nit);
                this.form.get('name').setValue(`${clientResponse.nombres} ${clientResponse.apellidos}`);
                this.form.get('date').setValue(res);

                this.loadAll();
              }
            });
          }
        }
      });
    }
  }

  queryClients(): void {
    this.clientService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.listClients = response;
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

  displayFn(user: string): string {
    return user ? user : '';
  }

  validateValueNit(): void {
    const control = this.form.get('nit');
    if (control.value === '' || control.value === null || control.value === undefined || control.invalid) {
      this.form.get('name').setValue(null);
    }
  }

  private _filter(nit: string): User[] {
    const filterValue = nit.toLowerCase();

    const found = this.listClients.filter(option => option.nit.toLowerCase().indexOf(filterValue) === 0);
    console.log(found)
    if (found.length > 0) {
      this.form.get('name').setValue(`${found[0].nombres} ${found[0].apellidos}`);
    } else {
      this.form.get('name').setValue(null);
    }

    return found;
  }

  createSale(): void {
    this.entitySale.serie = null;
    this.entitySale.fechaFactura = this.form.get('date').value;
    this.entitySale.idCliente = this.form.get('idClient').value;
    this.entitySale.idEmpleado = 1;
    console.log(this.entitySale)
    this.salesService.create(this.entitySale).subscribe(response => {
      this.router.navigate([`sales/sale/${response.idVenta}`]).then();
    });
  }

  openAdd(): void {
    if (!this.entitySale.idVenta) {
      if (this.form.valid) {
        const nitValue = this.form.get('nit').value;
        const findNit = this.listClients.find(item => item.nit === nitValue);

        console.log(findNit)
        if (findNit === undefined) {
          this.entityClient.nombres = this.form.get('name').value;
          this.entityClient.apellidos = null;
          this.entityClient.nit = this.form.get('nit').value;
          this.entityClient.genero = null;
          this.entityClient.telefono = null;
          this.entityClient.correo = null;

          this.clientService.create(this.entityClient).subscribe(response => {
            console.log(response);
            if (response) {
              this.form.get('idClient').setValue(response.idCliente);
              this.createSale();
            }
          });
        } else {
          this.form.get('idClient').setValue(findNit.idcliente);
          this.createSale();
        }
      }
    } else {
      const config: MatDialogConfig = {
        width: '40vw',
        disableClose: true,
        data: {
          idVenta: this.entitySale.idVenta
        }
      };

      const dialog = this.dialog.open(DialogAddSaleComponent, config);
      dialog.afterClosed().subscribe(response => {
        if (response && response.idVenta_detalle) {
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
          this.salesService.delete(item.idVenta_detalle).subscribe(
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
      this.countTotal += (+item.cantidad * item.precio_unitarui);
    });
  }

}
