import {Routes} from '@angular/router';
import {SalesComponent} from './sales/sales.component';
import {LogSalesComponent} from './log-sales/log-sales.component';
import {ShoppingComponent} from './shopping/shopping.component';
import {LogShoppingComponent} from './log-shopping/log-shopping.component';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [],
    children: [
      {path: 'sale', component: SalesComponent},
      {path: 'sale/:sale', component: SalesComponent},
      {path: 'log-sale', component: LogSalesComponent},
      {path: 'shopping', component: ShoppingComponent},
      {path: 'shopping/:id', component: ShoppingComponent},
      {path: 'log-shopping', component: LogShoppingComponent},
    ]
  }
];
