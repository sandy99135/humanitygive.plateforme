import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

    transform(value: string | Date): string {
    if (!value) {
      return '';
    }
    
    let date = new Date();
    let options = { timeZone: 'Indian/Antananarivo' };
    const dateString = date.toLocaleString('fr-FR', options); 
    const [datePart, timePart] = dateString.split(' ');
    const [d, m, y] = datePart.split('/');
    const dateNowMadagascar = `${y}-${m}-${d}T${timePart}`;

    const seconds = Math.floor((+(new Date(dateNowMadagascar)) - +new Date(value)) / 1000);
    if (seconds < 60) {
      return "a l'instant";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min `;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} heure${hours === 1 ? '' : 's'}`;
    }

    const days = Math.floor(hours / 24);
    if(days < 30 ){
      return `${days} jour${days === 1 ? '' : 's'} `;
    }

    const week = Math.floor(days / 7);
    if(week < 4 ){
      return `${week} semaine${week === 1 ? '' : 's'} `;
    }

    const month = Math.floor(days / 30);
    if(month < 12){
      return `${month} mois `;
    }

    const year = Math.floor(month / 12);
    return `aaaaa`;

  }

}
