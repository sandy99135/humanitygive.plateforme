import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heureMinute'
})
export class HeureMinutePipe implements PipeTransform {

    transform(value: string): string {
    if (!value) {
      return '';
    }
    let temps = value.split(":");
    let heures = temps[0];
    let minutes = temps[1];
    
    let heureFormattee = heures + ":";
    let reponse = heureFormattee

    return reponse;
  }

}
