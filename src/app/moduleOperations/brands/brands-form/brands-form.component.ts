import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as CONSTANTS from '../../../shared/constants';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter} from '@angular/material/core';
import {BrandsService} from '../../services/brands.service';

@Component({
  selector: 'app-brands-form',
  templateUrl: './brands-form.component.html',
  styleUrls: ['./brands-form.component.scss']
})
export class BrandsFormComponent implements OnInit {
  constants = CONSTANTS;

  @Output() onSuccessSubmit = new EventEmitter<any>();
  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  positionsList: any[] = [];
  form: FormGroup;
  entity: any = {};

  constructor(
    private service: BrandsService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');

    this.form = new FormGroup({
      brand: new FormControl(null, [Validators.required]),
    });

    this.loadAll();
  }

  loadAll(item?: any): void {
    this.entity = item;

    if (item) {
      this.form.get('brand').setValue(item.marca);
    } else {
      this.entity = {};
      this.form.get('brand').setValue(null);
    }
  }

  onSubmit(): void {
    this.entity.marca = this.form.get('brand').value;

    if (this.form.valid) {
      if (this.entity.idmarca) {
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
