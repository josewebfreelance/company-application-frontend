import {NgModule} from '@angular/core';
import {ShareModule} from '../module-share/share.module';
import {RouterModule} from '@angular/router';
import {DeleteConfirmationComponent} from '../module-share/delete-confirmation/delete-confirmation.component';
import {ClientsComponent} from './clients/clients.component';
import {OPERATION_ROUTES} from './operation.routing';
import {ClientsFormComponent} from './clients/clients-form/clients-form.component';
import {ClientsService} from './services/clients.service';
import {ProvidersComponent} from './providers/providers.component';
import {ProvidersFormComponent} from './providers/providers-form/providers-form.component';
import {ProvidersService} from './services/providers.service';
import {BrandsComponent} from './brands/brands.component';
import {BrandsFormComponent} from './brands/brands-form/brands-form.component';
import {BrandsService} from './services/brands.service';
import {ProductsComponent} from './products/products.component';
import {ProductsFormComponent} from './products/products-form/products-form.component';
import {ProductsService} from './services/products.service';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientsFormComponent,
    ProvidersComponent,
    ProvidersFormComponent,
    BrandsComponent,
    BrandsFormComponent,
    ProductsComponent,
    ProductsFormComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild(OPERATION_ROUTES)
  ],
  entryComponents: [
    DeleteConfirmationComponent
  ],
  providers: [
    ClientsService,
    ProvidersService,
    BrandsService,
    ProductsService
  ]
})
export class OperationModule {
}
