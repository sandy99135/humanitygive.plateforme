import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateJourString'
})
export class dateJourStringPipe implements PipeTransform {
  private joursSemaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  transform(value: Date | string): string {
    let date = new Date(value);
    const jourSemaineIndex = date.getDay();
    const jourMois = date.getDate();
    const nomJourSemaine = this.joursSemaine[jourSemaineIndex];
    return `${nomJourSemaine}`;
  }
}