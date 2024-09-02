import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mounth'
})
export class monthPipe implements PipeTransform {

    transform(value: string): string {
    if (!value) {
      return '';
    }
    return '' + new Date(value).toLocaleString("fr-FR", { month: "long" }).toUpperCase() +'' ;
  }

}
