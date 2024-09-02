import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class dayPipe implements PipeTransform {

    transform(value: string): string {
    if (!value) {
      return '';
    }
    return "" + new Date(value).getDate();
  }

}
