import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from './data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  data : any[] = data ;
  user : any ;

  option : number = 1 ;

  constructor( private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!)
  }

  changeOption(value : number) {
    this.option = value ;
  }

}