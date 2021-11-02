import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../shared/constants';
import {Cookie} from 'ng2-cookies';
import {Router} from '@angular/router';
import {ValidateSessionService} from './validate-session.service';

@Injectable()
export class SecurityService {

  url = `${API_URL}login`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  signIn(entity: any): Observable<any> {
    return this.http.post(`${this.url}`, entity);
  }

  saveToken(token: any): void {
    Cookie.set('isLogin', token.isLogin);
    Cookie.set('user', token.usuario);
  }

  validateSession(): boolean {
    return Cookie.check('isLogin');
  }

  validateRedirection(): void {
    if (!Cookie.check('isLogin')) {
      this.router.navigate([`/`]).then();
    } else {
      this.router.navigate([`sales/sale`]).then();
    }
  }
}
