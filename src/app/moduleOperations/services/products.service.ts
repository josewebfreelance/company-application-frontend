import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../shared/constants';

@Injectable()
export class ProductsService {

  url = `${API_URL}productos`;

  constructor(
    private http: HttpClient
  ) {
  }

  query(req?: any): Observable<any> {
    return this.http.get(`${this.url}`);
  }

  find(id?: any): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  create(entity: any): Observable<any> {
    return this.http.post(`${this.url}`, entity);
  }

  update(entity: any): Observable<any> {
    return this.http.post(`${this.url}`, entity);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {});
  }

}
