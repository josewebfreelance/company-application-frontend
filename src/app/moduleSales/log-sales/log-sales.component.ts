import {Component, OnInit} from '@angular/core';
import {SalesService} from '../services/sales.service';
import {MatTableDataSource} from '@angular/material/table';
import {ClientsService} from '../../moduleOperations/services/clients.service';
import {EmployeesService} from '../../securityModule/services/employees.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-log-sales',
  templateUrl: './log-sales.component.html',
  styleUrls: ['./log-sales.component.scss']
})
export class LogSalesComponent implements OnInit {

  dataSource;
  displayedColumns: string[] = ['date', 'sale', 'saleNumber', 'series', 'client', 'employee', 'status'];

  listClients: any[] = [];
  listEmployees: any[] = [];
  validData = true;

  constructor(
    private salesService: SalesService,
    private clientService: ClientsService,
    private employeesService: EmployeesService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.validData = false;
    this.queryClients();
    this.queryEmployees();

    this.salesService.query().subscribe(response => {
      if (response) {
        this.validData = true;
        this.dataSource = new MatTableDataSource(response);
        console.log(this.dataSource)
      } else {
        this.validData = false;
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  queryClients(): void {
    this.clientService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.listClients = response;
      }
    });
  }

  queryEmployees(): void {
    this.employeesService.query().subscribe(response => {
      if (response && response.length > 0) {
        this.listEmployees = response;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewDetail(sale: any): void {
    this.router.navigate([`sales/sale/${sale}`]).then();
  }

}
