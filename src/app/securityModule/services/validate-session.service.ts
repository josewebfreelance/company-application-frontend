import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ValidateSessionService {
  statusSubscribe = new BehaviorSubject(null);
  status = this.statusSubscribe.asObservable();
}
