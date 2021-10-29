import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../sales.component';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dialog-add-sale',
  templateUrl: './dialog-add-sale.component.html',
  styleUrls: ['./dialog-add-sale.component.scss']
})
export class DialogAddSaleComponent implements OnInit {

  form: FormGroup;
  products: any[] = [
    {id: 1, product: 'Computadora HP', price: 5000.00},
    {id: 2, product: 'Computadora DELL', price: 6000.00},
    {id: 3, product: 'Monitor Asus', price: 7000.00}
  ];
  filteredOptions: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<DialogAddSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      quantity: new FormControl(1),
      product: new FormControl(null),
      price: new FormControl(null),
      total: new FormControl({value: 0.00, disabled: true}),
    });

    this.filteredOptions = this.form.get('product').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.product),
        map(product => product ? this._filter(product) : this.products.slice())
      );
  }

  displayFn(item: any): string {
    return item ? item.product : '';
  }

  validateOnChange(): void {
    const controlProduct = this.form.get('product');
    const controlQuantity = this.form.get('quantity');
    const controlPrice = this.form.get('price');
    const controlTotal = this.form.get('total');

    if (controlProduct.valid) {
      controlPrice.setValue(controlProduct.value.price);
      controlTotal.setValue(+controlQuantity.value * +controlProduct.value.price);
    }
  }

  private _filter(product: string): any[] {
    const filterValue = product.toLowerCase();

    return this.products.filter(option => option.product.toLowerCase().includes(filterValue));
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
  }
}
