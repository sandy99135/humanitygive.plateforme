import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {

  sombre : boolean = false ;
  event_create : boolean = false ;

  constructor( private router: Router  , private location: Location ) {}

  ngOnInit(): void {
    this.contenerSombre();
  }
  
  contenerSombre(){
    this.sombre = true ;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(event.url == "/user/home" || event.url == "/user/activite" || event.url == "/user/profil-view"  || event.url == "/user/profile"){
          this.sombre = true
        }
        else {
          this.sombre = false
        }
      }
      if (event instanceof NavigationEnd) {
        event.url == "/event/create" ? this.event_create = true : this.event_create = false ;
      }
    });
    this.location.path() == "/event/create" ? this.event_create = true : this.event_create = false ;

      
    // if(
    //   this.location.path() == "/user/home" || 
    //   this.location.path() == "/user/activite" || 
    //   this.location.path() == "/user/profil-view" || 
    //   this.location.path() == "/user/profile" ||
    //   this.location.path() == "/user/compte" 
    //   ){
    //     this.sombre = true
    // }
    // else {
    //     this.sombre = false
    // }
    
  }

  
}
