import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {PositionsService} from '../../services/positions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PositionsFormComponent implements OnInit {

  @Output() onSuccessSubmit = new EventEmitter<any>();

  @ViewChild(FormGroupDirective) formView: FormGroupDirective;

  form: FormGroup;
  entity: any = {};

  constructor(
    private service: PositionsService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      position: new FormControl(null, [Validators.required])
    });

    this.loadAll();
  }

  loadAll(item?: any): void {
    if (item) {
      this.entity = item;
      this.form.get('position').setValue(item.puesto1);
    } else {
      this.entity = {};
      this.form.get('position').setValue(null);
    }
  }

  onSubmit(): void {
    this.entity.puesto1 = this.form.get('position').value;
    this.entity.mensajes = '';

    if (this.form.valid) {
      if (this.entity.idPuesto) {
        this.service.update(this.entity).subscribe(response => {
          this.notifications.success('Correcto', 'La acción se realizó con éxito.');
        }, error => {
          this.notifications.error('Error', error);
        });
      } else {
        this.service.create(this.entity).subscribe(response => {
          if (response) {
            this.notifications.success('Correcto', 'La acción se realizó con éxito.');
            this.successSubmit(response);
          }
        }, error => {
          this.notifications.error('Error', error);
          this.successSubmit({});
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
