import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as CONSTANTS from '../../../shared/constants';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';
import {ClientsService} from '../../services/clients.service';

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.scss']
})
export class ClientsFormComponent implements OnInit {
  constants = CONSTANTS;

  @Output() onSuccessSubmit = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  positionsList: any[] = [];
  form: FormGroup;
  entity: any = {};

  constructor(
    private service: ClientsService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      nit: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.pattern(this.constants.EMAIL_REGEXP)]),
      admissionDate: new FormControl(new Date(), [Validators.required]),
    });

    this.loadAll();
  }

  loadAll(item?: any): void {
    if (item) {
      this.form.get('lastName').setValue(item.apellidos);
      this.form.get('name').setValue(item.nombres);
      this.form.get('nit').setValue(item.nit);
      this.form.get('gender').setValue(item.genero);
      this.form.get('phone').setValue(item.telefono);
      this.form.get('email').setValue(item.correo);
      this.form.get('admissionDate').setValue(item.fechaingreso);
    } else {
      this.entity = {};
      this.form.get('lastName').setValue(null);
      this.form.get('name').setValue(null);
      this.form.get('nit').setValue(null);
      this.form.get('gender').setValue(null);
      this.form.get('phone').setValue(null);
      this.form.get('email').setValue(null);
      this.form.get('admissionDate').setValue(new Date());
    }
  }

  onSubmit(): void {
    this.entity.nombres = this.form.get('name').value;
    this.entity.apellidos = this.form.get('lastName').value;
    this.entity.nit = this.form.get('nit').value;
    this.entity.genero = this.form.get('gender').value;
    this.entity.telefono = this.form.get('phone').value;
    this.entity.correo = this.form.get('email').value;
    this.entity.fechaingreso = this.form.get('admissionDate').value;

    if (this.form.valid) {
      if (this.entity.idEmpleado) {
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
    this.form.get('admissionDate').setValue(new Date());

    this.onSuccessSubmit.emit({
      entity
    });
  }

  addItem(): void {
    this.loadAll({});
  }

}
