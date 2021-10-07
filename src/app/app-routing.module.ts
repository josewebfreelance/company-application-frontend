import {RouterModule, Routes} from '@angular/router';
import {SalesComponent} from './sales/sales.component';

export const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/sales', pathMatch: 'full'},
  {path: 'sales', component: SalesComponent},
];

export const routing = RouterModule.forRoot(APP_ROUTES, {useHash: true});
