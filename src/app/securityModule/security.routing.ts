import {Routes} from '@angular/router';
import {PositionsComponent} from './positions/positions.component';
import {EmployeesComponent} from './employees/employees.component';

export const POSITIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [],
    children: [
      {path: 'puestos', component: PositionsComponent},
      {path: 'empleados', component: EmployeesComponent},
    ]
  }
];
