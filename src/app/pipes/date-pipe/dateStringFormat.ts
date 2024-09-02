import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatDateString'
})
export class FormatDateStringPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {return ''} ;
    
        const months = [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
    
        const parts = value.split('T')[0].split('-');
        const day = parseInt(parts[2], 10);
        const month = months[parseInt(parts[1], 10) - 1];
        const year = parts[0];
    
        return `${day} ${month} ${year}`;
      }
}