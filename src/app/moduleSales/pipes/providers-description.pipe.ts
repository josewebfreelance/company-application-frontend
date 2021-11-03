import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'providersDescriptionPipe'
})
export class ProvidersDescriptionPipe implements PipeTransform {

  transform(value: any, list: any[]): any {
    let response = '';
    if (value && list) {
      const find = list.find(item => item.idProveedor === value);
      if (find !== undefined) {
        response = `${find.proveedor}`;
      }
    }
    return response;
  }
}
