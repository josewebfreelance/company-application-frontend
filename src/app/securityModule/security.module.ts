import {NgModule} from '@angular/core';
import {ShareModule} from '../module-share/share.module';
import {RouterModule} from '@angular/router';
import {PositionsComponent} from './positions/positions.component';
import {POSITIONS_ROUTES} from './security.routing';
import {PositionsService} from './services/positions.service';
import {PositionsFormComponent} from './positions/positions-form/positions-form.component';
import {DeleteConfirmationComponent} from '../module-share/delete-confirmation/delete-confirmation.component';
import {EmployeesComponent} from './employees/employees.component';
import {EmployeesFormComponent} from './employees/employees-form/employees-form.component';
import {EmployeesService} from './services/employees.service';


@NgModule({
  declarations: [
    PositionsComponent,
    PositionsFormComponent,
    EmployeesComponent,
    EmployeesFormComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild(POSITIONS_ROUTES)
  ],
  entryComponents: [
    DeleteConfirmationComponent
  ],
  exports: [
  ],
  providers: [
    PositionsService,
    EmployeesService
  ]
})
export class SecurityModule {
}
