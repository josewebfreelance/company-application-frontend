import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../sales.component';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ProductsService} from '../../../moduleOperations/services/products.service';
import {SalesService} from '../../services/sales.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-dialog-add-sale',
  templateUrl: './dialog-add-sale.component.html',
  styleUrls: ['./dialog-add-sale.component.scss'],
  providers: [ProductsService]
})
export class DialogAddSaleComponent implements OnInit {

  form: FormGroup;
  productsList: any[] = [];
  filteredOptions: Observable<any[]>;
  entity: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogAddSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductsService,
    private salesService: SalesService,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      quantity: new FormControl(1, [Validators.required]),
      product: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      total: new FormControl({value: 0.00, disabled: true}),
    });

    this.filteredOptions = this.form.get('product').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.producto),
        map(product => product ? this._filter(product) : this.productsList.slice())
      );
    this.queryProducts();
  }

  displayFn(item: any): string {
    return item ? item.producto : '';
  }

  queryProducts(): void {
    this.productService.query().subscribe(response => {
      if (response) {
        this.productsList = response;
      }
    });
  }

  validateOnChange(): void {
    const controlProduct = this.form.get('product');
    const controlQuantity = this.form.get('quantity');
    const controlPrice = this.form.get('price');
    const controlTotal = this.form.get('total');

    if (controlProduct.valid) {
      this.entity.idProducto = controlProduct.value.idProducto;
      controlPrice.setValue(controlProduct.value.precio_venta);
      controlTotal.setValue(+controlQuantity.value * +controlProduct.value.precio_venta);
    }
  }

  private _filter(product: string): any[] {
    const filterValue = product.toLowerCase();

    return this.productsList.filter(option => option.producto.toLowerCase().includes(filterValue));
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.form.valid) {
      this.entity.idVenta = +this.data.idVenta;
      this.entity.cantidad = this.form.get('quantity').value.toString();
      this.entity.precio_unitarui = this.form.get('price').value;

      this.salesService.createDetail(this.entity).subscribe(response => {
        if (response) {
          this.dialogRef.close(response);
          this.notifications.success('Correcto', 'La acción se realizó con éxito.');
        }
      }, error => {
        this.notifications.error('Error', error);
      });
    }
  }
}
