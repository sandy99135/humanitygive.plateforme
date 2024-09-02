import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'year'
})
export class yearPipe implements PipeTransform {

    transform(value: string): string {
    if (!value) {
      return '';
    }
    return "" + new Date(value).getFullYear();
  }

}
