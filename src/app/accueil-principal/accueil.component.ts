import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
})
export class AccueilPrincipalComponent implements OnInit {

  constructor( private router: Router  , private location: Location ) {}

  ngOnInit(): void {
    const currentURL = this.router.url;
    if(currentURL === '/'){
      this.router.navigate(['/home']);
    }
  }

}
