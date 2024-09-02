import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-show-public',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class DonateShowComponent implements OnInit {

  detail : number = 1 ;

  constructor( private router: Router) {}

  ngOnInit(): void {
  }

  changeDetail(value : number) {
    this.detail = value ;
  }

}