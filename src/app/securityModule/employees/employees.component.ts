import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {NotificationsService} from 'angular2-notifications';
import {HttpErrorResponse} from '@angular/common/http';
import {EmployeesFormComponent} from './employees-form/employees-form.component';
import {EmployeesService} from '../services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesComponent implements OnInit {
  @ViewChild('formComponent', {static: false}) formComponent: EmployeesFormComponent;


  list: any[] = [];
  itemSelected;

  constructor(
    private service: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private notifications: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.loadAll();
      }
    });
  }

  loadAll(): void {
    this.service.query().subscribe(response => {
      if (response && response.length > 0) {
        this.list = response;
      } else {
        this.list = [];
      }
    });
  }

  loadForm(item): void {
    if (item) {
      this.formComponent.loadAll(item);
      this.itemSelected = item;
    }
  }

  successSubmit(result: any): void {
    if (result) {
      this.loadAll();
    }
  }

  download(): void {
    this.service.query().subscribe(response => {
      if (response && response.length > 0) {
        let csv = 'No.,Nombre,Apellido,Dirección,Teléfono,DPI,Género,Fecha nacimiento,Puesto,Fecha inicio labores, Fecha ingreso\n';

        response.forEach((row) => {
          const tempRow = Object.values(row);
          csv += tempRow.join(',');
          csv += '\n';
        });

        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        hiddenElement.download = 'Empleados.csv';
        hiddenElement.click();
      }
    });
  }

  onDelete(item: any): void {
    const response = this.matDialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {}
    });

    response.afterClosed().subscribe(
      (data: boolean) => {
        if (data === true) {
          this.service.delete(item.idEmpleado).pipe().subscribe(
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
}
