import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  registro: any;
  title = '';
  viewTitle = false;

  constructor(
    private matDialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    if ( this.data ) {
        this.viewTitle = this.data.viewTitle;
         this.title = this.data.title;

         if ( this.title === 'SERIE' && this.data.viewTitle ) {

          this.registro = this.data.templateInfo;

         } else if ( this.data.viewTitle ) {

            this.title = this.data.title;
            this.registro = this.data.templateInfo.period === 'DEFAULT' ?
            this.data.templateInfo.period : this.transform(this.data.templateInfo.period);
         }
    }
  }

  onNoClick(): void {
    this.matDialogRef.close();
  }

  transform(value: any): any {
    let response = null;
    if (value) {
        const newValue = value.toString().trim();
        const fragment = newValue.split('-');
        response = `${fragment[1]}/${fragment[0]}`;
    }

    return response;
}

}
