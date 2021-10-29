import {Routes} from '@angular/router';
import {ClientsComponent} from './clients/clients.component';
import {ProvidersComponent} from './providers/providers.component';
import {BrandsComponent} from './brands/brands.component';
import {ProductsComponent} from './products/products.component';

export const OPERATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [],
    children: [
      {path: 'clientes', component: ClientsComponent},
      {path: 'proveedores', component: ProvidersComponent},
      {path: 'marcas', component: BrandsComponent},
      {path: 'productos', component: ProductsComponent},
    ]
  }
];
