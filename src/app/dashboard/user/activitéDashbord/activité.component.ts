import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { parainage } from './data';

@Component({
  selector: 'app-activité',
  templateUrl: './activité.component.html',
  styleUrls: ['./activité.component.scss'],
})
export class ActivitéComponent implements OnInit {
 
  user : any ;
  active : number = 1 ;
  
  constructor( private router: Router) {}

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user')!)
    // if (this.router.url === '/user/activite/donate') {
    //   this.active = 1;
    // }
    if (this.router.url === '/user/activite/need' || this.router.url === '/user/activite/need/view') {
      this.active = 2;
    }
    else{
      this.active = 1;
    }
  }
  


}