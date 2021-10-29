import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PositionsService} from '../services/positions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PositionsFormComponent} from './positions-form/positions-form.component';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {NotificationsService} from 'angular2-notifications';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PositionsComponent implements OnInit {
  @ViewChild('formComponent', {static: false}) formComponent: PositionsFormComponent;


  list: any[] = [];
  itemSelected;

  constructor(
    private service: PositionsService,
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

  onDelete(item: any): void {
    const response = this.matDialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      data: {}
    });

    response.afterClosed().subscribe(
      (data: boolean) => {
        if (data === true) {
          this.service.delete(item.idPuesto).subscribe(
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
