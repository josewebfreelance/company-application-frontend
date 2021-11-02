import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'clientDescriptionPipe'
})
export class ClientDescriptionPipe implements PipeTransform {

  transform(value: any, list: any[]): any {
    let response = '';
    if (value && list) {
      const find = list.find(item => item.idcliente === value);
      if (find !== undefined) {
        response = `${find.nombres} ${find.apellidos}`;
      }
    }
    return response;
  }
}
