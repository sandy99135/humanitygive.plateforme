import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import { parainage } from '../data';

@Component({
  selector: 'view-need-activite',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.scss'],
})
export class ActiviteNeedViewComponent implements OnInit {
 
  detail : number = 1 ;

  constructor( private router: Router) {}

  ngOnInit(): void {
  }

  changeDetail(value : number) {
    this.detail = value ;
  }

}