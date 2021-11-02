import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ProductsService} from '../../../moduleOperations/services/products.service';
import {SalesService} from '../../services/sales.service';
import {NotificationsService} from 'angular2-notifications';
import {ShoppingService} from '../../services/shopping.service';

@Component({
  selector: 'app-dialog-add-shopping',
  templateUrl: './dialog-add-shopping.component.html',
  styleUrls: ['./dialog-add-shopping.component.scss'],
  providers: [ProductsService]
})
export class DialogAddShoppingComponent implements OnInit {

  form: FormGroup;
  productsList: any[] = [];
  filteredOptions: Observable<any[]>;
  entity: any = {};
  statusResponse = true;

  constructor(
    public dialogRef: MatDialogRef<DialogAddShoppingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductsService,
    private shoppingService: ShoppingService,
    private notifications: NotificationsService
  ) {
  }

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

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.form.valid) {
      this.entity.idCompra = +this.data.idCompra;
      this.entity.cantidad = +this.form.get('quantity').value.toString();
      this.entity.precio_costo_unitario = this.form.get('price').value;
      this.statusResponse = false;

      this.shoppingService.createDetail(this.entity).subscribe(response => {
        if (response) {
          this.statusResponse = true;
          this.dialogRef.close(response);
          this.notifications.success('Correcto', 'La acción se realizó con éxito.');
        }
      }, error => {
        this.statusResponse = false;
        this.notifications.error('Error', error);
      });
    }
  }

  private _filter(product: string): any[] {
    const filterValue = product.toLowerCase();

    return this.productsList.filter(option => option.producto.toLowerCase().includes(filterValue));
  }
}
