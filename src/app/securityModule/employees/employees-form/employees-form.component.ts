import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeesService} from '../../services/employees.service';
import * as CONSTANTS from '../../../shared/constants';
import {PositionsService} from '../../services/positions.service';
import {NotificationsService} from 'angular2-notifications';
import {DateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesFormComponent implements OnInit {
  constants = CONSTANTS;

  @Output() onSuccessSubmit = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  positionsList: any[] = [];
  form: FormGroup;
  entity: any = {};

  constructor(
    private service: EmployeesService,
    private positionService: PositionsService,
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
      address: new FormControl(null, [Validators.required]),
      dpi: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      dateStartWork: new FormControl(new Date(), [Validators.required]),
      admissionDate: new FormControl(new Date(), [Validators.required]),
      birthDate: new FormControl(new Date(), [Validators.required]),
    });

    this.queryPositions();
    this.loadAll();
  }

  queryPositions(): void {
    this.positionService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.positionsList = response;
      }
    });
  }

  loadAll(item?: any): void {
    if (item) {
      this.entity = item;
      this.form.get('lastName').setValue(item.apellido);
      this.form.get('address').setValue(item.direccion);
      this.form.get('dpi').setValue(item.dpi);
      this.form.get('dateStartWork').setValue(item.fecha_inicio_labores);
      this.form.get('birthDate').setValue(item.fecha_nacimiento);
      this.form.get('admissionDate').setValue(item.fechaingreso);
      this.form.get('gender').setValue(item.genero);
      this.form.get('position').setValue(item.idPuesto.toString());
      this.form.get('name').setValue(item.nombre);
      this.form.get('phone').setValue(item.telefono);
    } else {
      this.entity = {};
      this.form.get('lastName').setValue(null);
      this.form.get('address').setValue(null);
      this.form.get('dpi').setValue(null);
      this.form.get('dateStartWork').setValue(new Date());
      this.form.get('birthDate').setValue(new Date());
      this.form.get('admissionDate').setValue(new Date());
      this.form.get('gender').setValue(null);
      this.form.get('position').setValue(null);
      this.form.get('name').setValue(null);
      this.form.get('phone').setValue(null);
    }
  }

  onSubmit(): void {
    this.entity.apellido = this.form.get('lastName').value;
    this.entity.direccion = this.form.get('address').value;
    this.entity.dpi = this.form.get('dpi').value;
    this.entity.fecha_inicio_labores = this.form.get('dateStartWork').value;
    this.entity.fecha_nacimiento = this.form.get('birthDate').value;
    this.entity.fechaingreso = this.form.get('admissionDate').value;
    this.entity.genero = this.form.get('gender').value;
    this.entity.idPuesto = +this.form.get('position').value;
    this.entity.nombre = this.form.get('name').value;
    this.entity.telefono = this.form.get('phone').value;

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
    this.form.get('dateStartWork').setValue(new Date());
    this.form.get('birthDate').setValue(new Date());
    this.form.get('admissionDate').setValue(new Date());

    this.onSuccessSubmit.emit({
      entity
    });
  }

  addItem(): void {
    this.loadAll({});
  }

}
