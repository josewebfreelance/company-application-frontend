import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DeleteConfirmationComponent} from '../../module-share/delete-confirmation/delete-confirmation.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {ProductsService} from '../services/products.service';
import {ProductsFormComponent} from './products-form/products-form.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
  @ViewChild('formComponent', {static: false}) formComponent: ProductsFormComponent;

  list: any[] = [];
  itemSelected;

  constructor(
    private service: ProductsService,
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

  download(): void {
    this.service.query().subscribe(response => {
      if (response && response.length > 0) {
        let csv = 'No.,Producto,Marca,Imagen,Precio costo,Precio venta,Existencia,Descripción\n';

        response.forEach((row) => {
          const tempRow = Object.values(row);
          csv += tempRow.join(',');
          csv += '\n';
        });

        const hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        hiddenElement.download = 'Productos.csv';
        hiddenElement.click();
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
