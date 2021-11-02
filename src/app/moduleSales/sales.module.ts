import {NgModule} from '@angular/core';
import {SalesComponent} from './sales/sales.component';
import {ShareModule} from '../module-share/share.module';
import {RouterModule} from '@angular/router';
import {SALES_ROUTES} from './sales.routing';
import {LogSalesComponent} from './log-sales/log-sales.component';
import {DialogAddSaleComponent} from './sales/dialog-add-sale/dialog-add-sale.component';
import {ClientsService} from '../moduleOperations/services/clients.service';
import {SalesService} from './services/sales.service';
import {ProductDescriptionPipe} from './sales/product-description.pipe';
import {ClientDescriptionPipe} from './pipes/client-description.pipe';
import {ProductsService} from '../moduleOperations/services/products.service';
import {EmployeesService} from '../securityModule/services/employees.service';
import {EmployeeDescriptionPipe} from './pipes/employee-description.pipe';
import {ShoppingComponent} from './shopping/shopping.component';
import {DialogAddShoppingComponent} from './shopping/dialog-add-shopping/dialog-add-shopping.component';
import {ShoppingService} from './services/shopping.service';
import {LogShoppingComponent} from './log-shopping/log-shopping.component';

@NgModule({
  declarations: [
    SalesComponent,
    LogSalesComponent,
    DialogAddSaleComponent,
    ProductDescriptionPipe,
    ClientDescriptionPipe,
    EmployeeDescriptionPipe,
    ShoppingComponent,
    DialogAddShoppingComponent,
    LogShoppingComponent,
  ],
  imports: [
    ShareModule,
    RouterModule.forChild(SALES_ROUTES)
  ],
  entryComponents: [
    DialogAddSaleComponent
  ],
  providers: [
    ClientsService,
    ProductsService,
    EmployeesService,
    SalesService,
    ShoppingService
  ]
})
export class SalesModule {
}
