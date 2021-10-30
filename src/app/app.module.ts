import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app-routing';
import {ShareModule} from './module-share/share.module';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {LoginComponent} from './securityModule/login/login.component';
import {BlockUIModule} from 'ng-block-ui';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BlockUIModule.forRoot({
      message: 'Procesando',
      delayStart: 150,
      delayStop: 150
    }),
    CommonModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ShareModule,
    routing,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
