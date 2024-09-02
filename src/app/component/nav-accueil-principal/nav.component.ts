import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-principal',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavPrincipalComponent implements OnInit {

  menu_active : number = 1 ;
  show_auth : boolean = false ;
  show_auth_outside : boolean = false ;
  hamberger : boolean = false ;
  hambergerOutside:boolean = false ;

  constructor( private router: Router  , private location: Location) {}


  ngOnInit(): void {
  }

  menuActive(value : number){
    this.menu_active = value ;
    this.hamberger = false;
    this.hambergerOutside = false;
  }

  showAuth(){
    if(this.show_auth == false){
      this.show_auth = true;
      setTimeout(() => {
      this.show_auth_outside = true;
      }, 50);
    }
    else{
      this.show_auth = false;
      this.show_auth_outside = false;
    }
  }

  handleClickOutsideFiltre(){
    if(this.show_auth_outside == true){
      this.show_auth = false;
      this.show_auth_outside = false;
    }
  }

  
  affHamberger() {
    
    if(this.hamberger == false){
      this.hamberger = true;
      setTimeout(() => {
        this.hambergerOutside = true;
      }, 50);
    }
    else{
      this.hamberger = false;
      this.hambergerOutside = false;
    }
  }


  handleClickOutsideHamberger(){
    if(this.hambergerOutside == true){
      this.hamberger = false;
      this.hambergerOutside = false;
    }
  }

  
}
