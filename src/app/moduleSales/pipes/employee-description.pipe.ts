import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'employeeDescriptionPipe'
})
export class EmployeeDescriptionPipe implements PipeTransform {

  transform(value: any, list: any[]): any {
    let response = '';
    if (value && list) {
      const find = list.find(item => item.idPuesto === value);
      if (find !== undefined) {
        response = `${find.nombre} ${find.apellido}`;
      }
    }
    return response;
  }
}
