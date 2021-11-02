import {Component, OnInit} from '@angular/core';
import {Options} from 'angular2-notifications';
import {SecurityService} from './securityModule/services/security.service';
import {ValidateSessionService} from './securityModule/services/validate-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'company-frontend';
  isLogin = false;

  notificationOptions: Options = {
    timeOut: 6000
  };

  menu: any[] = [
    {
      id: 1, title: 'VENTAS', icon: '',
      child: [
        {id: 2, title: 'Nueva', icon: '', route: 'sales/sale', child: []},
        {id: 3, title: 'Consulta', icon: '', route: 'sales/log-sale', child: []},
      ]
    },
    {
      id: 10, title: 'COMPRAS', icon: '',
      child: [
        {id: 11, title: 'Nueva', icon: '', route: 'sales/shopping', child: []},
        {id: 12, title: 'Consulta', icon: '', route: 'sales/log-shopping', child: []},
      ]
    },
    {
      id: 20, title: 'MANENIMIENTOS', icon: '',
      child: [
        {id: 21, title: 'Puestos', icon: '', route: 'seguridad/puestos', child: []},
        {id: 22, title: 'Empleados', icon: '', route: 'seguridad/empleados', child: []},
        {id: 23, title: 'Clientes', icon: '', route: 'operaciones/clientes', child: []},
        {id: 24, title: 'Proveedores', icon: '', route: 'operaciones/proveedores', child: []},
        {id: 25, title: 'Marcas', icon: '', route: 'operaciones/marcas',  child: []},
        {id: 26, title: 'Productos', icon: '', route: 'operaciones/productos', child: []},
      ]
    }
  ];

  constructor(
    private securityService: SecurityService,
    private validateSession: ValidateSessionService
  ) {
  }

  ngOnInit(): void {
    this.validateSession.statusSubscribe.next(this.securityService.validateSession());

    this.validateSession.status.subscribe(response => {
      this.isLogin = response;
      this.securityService.validateRedirection();
    });
  }
}
