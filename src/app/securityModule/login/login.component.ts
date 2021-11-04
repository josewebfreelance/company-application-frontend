import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SecurityService} from '../services/security.service';
import {Router} from '@angular/router';
import {ValidateSessionService} from '../services/validate-session.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  validateResponse = true;

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private validateSession: ValidateSessionService,
    private notifications: NotificationsService
  ) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('', [Validators.required]),
      pass: new FormControl('', [Validators.required])
    });

    this.validateSession.status.subscribe(response => {
      console.log(response);
    });
/*    if (this.securityService.validateSession()) {
      this.router.navigate([`sales/sale`]).then();
    }*/
  }

  onSubmit(): void {
    this.validateResponse = false;

    const entity = {
      usuario: this.form.get('user').value,
      contraseña: this.form.get('pass').value
    };
    if (this.form.valid) {
      this.securityService.signIn(entity).subscribe(response => {
        if (response) {
          this.validateResponse = true;

          if (response.idUsuario) {
            response.isLogin = true;
            this.securityService.saveToken(response);
            this.validateSession.statusSubscribe.next(this.securityService.validateSession());
            // this.securityService.validateRedirection();
          } else {
            this.validateResponse = true;
            response.isLogin = false;
            this.notifications.error('Error', 'Credenciales invalidas, intente de nuevo.');
          }
        }
      }, error => {
        this.validateResponse = true;
        this.notifications.error('Error', error.error);
      });
    }
  }
}
