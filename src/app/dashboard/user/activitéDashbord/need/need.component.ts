import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
import { parainage } from '../data';

@Component({
  selector: 'need-activite',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.scss'],
})
export class ActiviteNeedComponent implements OnInit {
 
  constructor( private router: Router) {}

  ngOnInit() {
  }

  view() {
    this.router.navigate(['/user/need/view']);
  }

}