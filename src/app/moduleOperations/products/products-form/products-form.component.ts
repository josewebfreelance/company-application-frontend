import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as CONSTANTS from '../../../shared/constants';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';
import {BrandsService} from '../../services/brands.service';
import {ProductsService} from '../../services/products.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {
  constants = CONSTANTS;

  @Output() onSuccessSubmit = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  brandsList: any[] = [];
  form: FormGroup;
  entity: any = {};
  photo;

  constructor(
    private service: ProductsService,
    private brandsService: BrandsService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');

    this.form = new FormGroup({
      product: new FormControl(null, [Validators.required]),
      brand: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      image: new FormControl(null),
      costPrice: new FormControl(null, [Validators.required, Validators.max(9999999999)]),
      costSale: new FormControl(null, [Validators.required, Validators.max(9999999999)]),
      stock: new FormControl(null, [Validators.required, Validators.max(9999999999)]),
      ingreso: new FormControl(new Date(), [Validators.required]),
    });

    this.queryBrands();
    this.loadAll();
  }

  queryBrands(): void {
    this.brandsService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.brandsList = response;
      }
    });
  }

  loadAll(item?: any): void {
    this.entity = item;

    if (item) {
      this.form.get('product').setValue(item.producto);
      this.form.get('brand').setValue(item.idMarca.toString());
      this.form.get('description').setValue(item.descripcion);
      // this.form.get('image').setValue(item.imagen);
      this.photo = item.imagen;
      this.form.get('costPrice').setValue(item.precio_costo);
      this.form.get('costSale').setValue(item.precio_venta);
      this.form.get('stock').setValue(item.existencia);
    } else {
      this.entity = {};
      this.form.get('product').setValue(null);
      this.form.get('brand').setValue(null);
      this.form.get('description').setValue(null);
      this.photo = null;
      // this.form.get('image').setValue(null);
      this.form.get('costPrice').setValue(null);
      this.form.get('costSale').setValue(null);
      this.form.get('stock').setValue(null);
    }
  }

  onSubmit(): void {
    console.log(this.photo)
    this.entity.producto = this.form.get('product').value;
    this.entity.idMarca = +this.form.get('brand').value;
    this.entity.descripcion = this.form.get('description').value;
    this.entity.imagen = this.photo;
    this.entity.precio_costo = +this.form.get('costPrice').value;
    this.entity.precio_venta = +this.form.get('costSale').value;
    this.entity.existencia = +this.form.get('stock').value;
    this.entity.fecha_ingreso = this.form.get('ingreso').value;

    if (this.form.valid) {
      if (this.entity.idProducto) {
        this.service.update(this.entity).subscribe(response => {
          this.notifications.success('Correcto', 'La acción se realizó con éxito.');
        });
      } else {
        this.service.create(this.entity).subscribe(response => {
          if (response) {
            this.successSubmit(response);
            this.notifications.success('Correcto', 'La acción se realizó con éxito.');
          }
        }, error => {
          this.successSubmit({});
          this.notifications.error('Error', error);
        });
      }
    }
  }

  handleImage(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.photo = reader.result;

      reader.readAsDataURL(file);
    }
  }

  successSubmit(entity: any): void {
    this.formView.resetForm();

    this.onSuccessSubmit.emit({
      entity
    });
  }

  addItem(): void {
    this.loadAll({});
  }

}
