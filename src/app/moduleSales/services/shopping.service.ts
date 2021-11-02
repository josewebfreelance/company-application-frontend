import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../shared/constants';

@Injectable()
export class ShoppingService {

  url = `${API_URL}compras`;
  urlDetail = `${API_URL}ComprasDetalle`;

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
    return this.http.delete(`${this.urlDetail}/${id}`, {});
  }

  createDetail(entity: any): Observable<any> {
    return this.http.post(`${this.urlDetail}`, entity);
  }

  findDetail(id?: any): Observable<any> {
    return this.http.get(`${this.urlDetail}/${id}`);
  }

  queryDetailSale(id?: any): Observable<any> {
    return this.http.get(`${this.urlDetail}/getallcom/${id}`);
  }
}
