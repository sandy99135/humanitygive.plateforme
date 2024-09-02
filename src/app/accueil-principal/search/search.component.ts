import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'search-home',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchHomePrincipalComponent implements OnInit {

  constructor( private router: Router  , private location: Location ) {}

  ngOnInit(): void {

  }

  

}
