import {NgModule} from '@angular/core';
import {SalesComponent} from './sales/sales.component';
import {ShareModule} from '../module-share/share.module';
import {RouterModule} from '@angular/router';
import {SALES_ROUTES} from './sales.routing';
import {LogSalesComponent} from './log-sales/log-sales.component';
import {DialogAddSaleComponent} from './sales/dialog-add-sale/dialog-add-sale.component';

@NgModule({
  declarations: [
    SalesComponent,
    LogSalesComponent,
    DialogAddSaleComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild(SALES_ROUTES)
  ],
  entryComponents: [
    DialogAddSaleComponent
  ]
})
export class SalesModule {
}
