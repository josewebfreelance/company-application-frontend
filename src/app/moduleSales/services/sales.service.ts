import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../shared/constants';

@Injectable()
export class BinnacleService {

  url = API_URL;

  constructor(
    private http: HttpClient
  ) {
  }

  query(req?: any): Observable<any> {
    return this.http.get(`${this.url}/api/audit`);
  }

}
