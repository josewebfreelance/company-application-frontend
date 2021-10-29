import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DateAdapter} from '@angular/material/core';
import {NitValidator} from '../../shared/validators/nit.validator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DialogAddSaleComponent} from './dialog-add-sale/dialog-add-sale.component';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';

export interface User {
  nit: string;
  name: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

  form: FormGroup;
  options: User[] = [
    {nit: '67860087', name: 'Jose Lemus'},
    {nit: '234567', name: 'Shelley'},
    {nit: '456789', name: 'Igor'}
  ];
  filteredOptions: Observable<User[]>;

  dataSource: any[] = [];
  displayedColumns: string[] = ['no', 'quantity', 'description', 'value'];

  constructor(
    private dateAdapter: DateAdapter<any>,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.dateAdapter.setLocale('es');

    this.form = new FormGroup({
      nit: new FormControl(null, [NitValidator.verifyNIT(false, true)]),
      name: new FormControl(null),
      address: new FormControl(null),
      date: new FormControl(new Date()),
    });

    this.form.get('date').disable();

    this.filteredOptions = this.form.get('nit').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nit),
        map(nit => nit ? this._filter(nit) : this.options.slice())
      );
  }

  displayFn(user: string): string {
    return user ? user : '';
  }

  validateValueNit(): void {
    const control = this.form.get('nit');
    if (control.value === '' || control.value === null || control.value === undefined || control.invalid) {
      this.form.get('name').setValue(null);
    }
  }

  private _filter(nit: string): User[] {
    const filterValue = nit.toLowerCase();

    const found = this.options.filter(option => option.nit.toLowerCase().indexOf(filterValue) === 0);
    if (found.length > 0) {
      this.form.get('name').setValue(found[0].name);
    } else {
      this.form.get('name').setValue(null);
    }

    return found;
  }

  openAdd(): void {
    const config: MatDialogConfig = {
      width: '40vw',
      disableClose: true
    };

    this.dialog.open(DialogAddSaleComponent, config);
  }

}
