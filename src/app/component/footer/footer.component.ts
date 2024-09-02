import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  accueil : boolean = false ;
  
  constructor( private router: Router  , private location: Location  ) {}

  ngOnInit(): void {
    this.siAccueil();
  }
  
  siAccueil(){
    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.url == "/home"  ? this.accueil = true : this.accueil = false
      }
    });
    this.location.path() == "/home" ? this.accueil = true : this.accueil = false ;

  }
}
