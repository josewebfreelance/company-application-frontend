import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'productDescriptionPipe'
})
export class ProductDescriptionPipe implements PipeTransform {

  transform(value: any, list: any[]): any {
    let response = '';
    if (value && list) {
      const find = list.find(item => item.idProducto === value);
      if (find !== undefined) {
        response = find.descripcion;
      }
    }
    return response;
  }
}
