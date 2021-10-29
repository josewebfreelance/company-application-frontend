import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as CONSTANTS from '../../../shared/constants';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';
import {ProvidersService} from '../../services/providers.service';

@Component({
  selector: 'app-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.scss']
})
export class ProvidersFormComponent implements OnInit {
  constants = CONSTANTS;

  @Output() onSuccessSubmit = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  positionsList: any[] = [];
  form: FormGroup;
  entity: any = {};

  constructor(
    private service: ProvidersService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');

    this.form = new FormGroup({
      provider: new FormControl(null, [Validators.required]),
      nit: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
    });

    this.loadAll();
  }

  loadAll(item?: any): void {
    this.entity = item;
    if (item) {
      this.form.get('provider').setValue(item.proveedor);
      this.form.get('nit').setValue(item.nit);
      this.form.get('address').setValue(item.direccion);
      this.form.get('phone').setValue(item.telefono);
    } else {
      this.entity = {};
      this.form.get('provider').setValue(null);
      this.form.get('nit').setValue(null);
      this.form.get('address').setValue(null);
      this.form.get('phone').setValue(null);
    }
  }

  onSubmit(): void {
    this.entity.proveedor = this.form.get('provider').value;
    this.entity.nit = this.form.get('nit').value;
    this.entity.direccion = this.form.get('address').value;
    this.entity.telefono = this.form.get('phone').value;

    if (this.form.valid) {
      if (this.entity.idProveedor) {
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
