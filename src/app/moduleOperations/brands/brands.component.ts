import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {HttpErrorResponse} from '@angular/common/http';
import {BrandsFormComponent} from './brands-form/brands-form.component';
import {BrandsService} from '../services/brands.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BrandsComponent implements OnInit {
  @ViewChild('formComponent', {static: false}) formComponent: BrandsFormComponent;

  list: any[] = [];
  itemSelected;

  constructor(
    private service: BrandsService,
    private router: Router,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private notifications: NotificationsService,
  ) {
  }

  ngOnInit() {
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
          this.service.delete(item.idmarca).subscribe(
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
