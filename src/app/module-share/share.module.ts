import {NgModule} from '@angular/core';
import {MaterialModule} from '../materialmodule/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeleteConfirmationComponent} from './delete-confirmation/delete-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteConfirmationComponent
  ],
  declarations: [
    DeleteConfirmationComponent
  ]
})
export class ShareModule {
}
