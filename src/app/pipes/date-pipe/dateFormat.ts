import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from 'src/app/services/date.service';

@Pipe({
  name: 'dateFormat'
})
export class dateFormatPipe implements PipeTransform {

  constructor(
    private dService: DateService,
) { }

    transform(value: string): string {
    if (!value) {
      return '';
    }
    return this.dService.format(new Date(value),'JMA') ;
  }

}
