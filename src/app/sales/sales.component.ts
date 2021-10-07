import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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

  form: FormGroup;
  options: User[] = [
    {nit: '123456', name: 'Mary'},
    {nit: '234567', name: 'Shelley'},
    {nit: '456789', name: 'Igor'}
  ];
  filteredOptions: Observable<User[]>;

  constructor() {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      nit: new FormControl(null),
      name: new FormControl(null),
      address: new FormControl(null),
    });

    this.filteredOptions = this.form.get('nit').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nit),
        map(nit => nit ? this._filter(nit) : this.options.slice())
      );
  }

  displayFn(user: User): string {
    return user && user.nit ? user.nit : '';
  }

  private _filter(nit: string): User[] {
    const filterValue = nit.toLowerCase();

    return this.options.filter(option => option.nit.toLowerCase().indexOf(filterValue) === 0);
  }

}
