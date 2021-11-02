import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './securityModule/login/login.component';

export const APP_ROUTES: Routes = [
  // {path: '', redirectTo: '/sales/sale', pathMatch: 'full'},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {
    path: 'sales',
    loadChildren: () => import('./moduleSales/sales.module').then(s => s.SalesModule),
  },
  {
    path: 'seguridad',
    loadChildren: () => import('./securityModule/security.module').then(s => s.SecurityModule),
  },
  {
    path: 'operaciones',
    loadChildren: () => import('./moduleOperations/operation.module').then(s => s.OperationModule),
  },
];

export const routing = RouterModule.forRoot(APP_ROUTES, {useHash: true});
