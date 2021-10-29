import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {routing} from './app-routing';
import {ShareModule} from './module-share/share.module';
import {HomeComponent} from './home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {SimpleNotificationsModule} from 'angular2-notifications';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    ShareModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
