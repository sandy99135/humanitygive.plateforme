import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { dayPipe } from '../pipes/date-pipe/dayPipe';
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  formatDate(date: Date, format: string): string {
    const datePipe: any = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  // format(date: any) {
  //   var year = date.getFullYear();
  //   var month = ('0' + (date.getMonth() + 1)).slice(-2);
  //   var day = ('0' + date.getDate()).slice(-2);
  //   return year + '-' + month + '-' + day;
  // }

  format(date:any , format : string = "" , separate : boolean = false) {
    // var year = date.getFullYear();
    // var month = ('0' + (date.getMonth() + 1)).slice(-2);
    // var day = ('0' + date.getDate()).slice(-2);
    // return year + '-' + month + '-' + day;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if(format == "JMA" ){
      if( separate) {
        return `${day}/${month}/${year}`;
      }
      else {
        return `${day}-${month}-${year}`;
      }
    }

    return `${year}-${month}-${day}`;
  }

  getDaysArray = function (start: Date, end: Date) {
    for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  getDaysArrayFromData = function (data: any[]) {
    let dayArray: any[] = [];
    let joursEnLettres = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    data[0].details.forEach((element: any) => {
      let jour = new Date(element.dateJour).getDate();
      let lettre = joursEnLettres[new Date(element.dateJour).getDay()]
      dayArray.push({ chiffre: jour, lettre: lettre })
    });
    // console.log(dayArray);
    return dayArray;
  };

  getFistDayOfWeek(date: Date) {
    return new Date(date.setDate(date.getDate() - date.getDay() + 1));
  }

  getLastDayOfWeek(date: Date) {
    const hier = new Date(date); //return d'une jour car semain en js Dimanche a Samedi
    hier.setDate(date.getDate() - 1);
    return new Date(hier.setDate(hier.getDate() - hier.getDay() + 7))
  }

  getDatePlusUn = function (Date: Date) {
    let date: Date;
    date = Date;
    date.setDate(Date.getDate() + 1);
    return date;
  }

  getDateMoinUn = function (Date: Date) {
    let date: Date;
    date = Date;
    date.setDate(Date.getDate() - 1);
    return date;
  }

  getDateMoinDeux = function (Date: Date) {
    let date: Date;
    date = Date;
    date.setDate(Date.getDate() - 2);
    return date;
  }


  getStartDate = function (endDate: Date) {
    let date: Date;
    date = endDate;
    date.setDate(endDate.getDate() - 20);
    return date;
  }

  getArraySemaineActive(endDate: Date) {
    let first = this.getFistDayOfWeek(new Date(endDate.setDate(endDate.getDate() - 1)))
    let preParse = this.getDaysArray(first, endDate);
    let parse: any[] = []
    for (let i = 0; i < preParse.length; i++) {
      parse = [...parse, preParse[i].getDate()];
    }
    return parse
  }

  getWeek(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceFirstDay = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const week = Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
    return week;
  }

  getWeekArray(date: Date) {
    let semaine_3 = this.getWeek(date)
    let semaine_2 = this.getWeek(new Date(date.setDate(date.getDate() - 7)))
    let semaine_1 = this.getWeek(new Date(date.setDate(date.getDate() - 7)))
    return [semaine_1, semaine_2, semaine_3]
  }

  getFirstAndLastDaysOfMonth(date: Date) {
    let year = date.getFullYear();
    let mounth = date.getMonth();
    return this.FirstAndLastDaysOfMonth(year, mounth)
  }

  FirstAndLastDaysOfMonth(year: any, month: any) {
    let firstDay = new Date(year, month, 1);
    let lastDay = new Date(year, month + 1, 0);

    let firstDayString = this.format(firstDay);
    let lastDayString = this.format(lastDay);

    return {
      firstDay: firstDay,
      lastDay: lastDay
    };
  }

  getDateMoisPrecedent(date: Date) {
    return date.setMonth(date.getMonth() - 1);
  }

  getDateMoisNext(date: Date) {
    return date.setMonth(date.getMonth() + 1);
  }

  getDayInMouth(date: Date, Day: number) {
    return new Date(date.setDate(Day));
  }

  getFirst27AndLast26DaysOfMonth(date: Date) {
    const madate: Date = new Date(date); // new Date() pour que date qoit constante
    let day26 = this.getDayInMouth(madate, 27);
    let date_mois_precedent = new Date(this.getDateMoisPrecedent(madate));
    let day27 = this.getDayInMouth(date_mois_precedent, 28);

    return {
      firstDay: day27,
      lastDay: day26
    };
  }

  getAllDimancheOfMonth(date: Date) {
    const sundays = [];
    const firstDay = this.getFirstAndLastDaysOfMonth(date).firstDay;
    const lastDay = this.getFirstAndLastDaysOfMonth(date).lastDay;

    for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0) { // 0 corresponds to Sunday
        sundays.push(date.getDate());
      }
    }

    return sundays;
  }

}
