import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  url : string = environment.URI + "/api/File/readImage?";
  user!: any;
  menu_active: number = 1;
  show_auth: boolean = false;
  show_auth_outside: boolean = false;
  hamberger: boolean = false;
  hambergerOutside: boolean = false;
  compte !: string;

  constructor(private router: Router, private location: Location) { }


  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!)
    console.log(this.user);
    if (this.router.url === '/user/home') {
      this.menu_active = 1;
    }
    if (this.router.url === '/user/profile') {
      this.menu_active = 2;
    }
    if (this.router.url === '/user/activite/need' || this.router.url === '/user/activite/donate') {
      this.menu_active = 3;
    }
    if (this.router.url === '/user/compte') {
      this.menu_active = 4;
    }

   this.user.type == 1 ? this.compte = "Giver" : this.compte = "Association"

  }

  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name +"&type=" + type ;
  }


  logOut() {
    localStorage.clear();
    this.router.navigate(['/auth/login/email']);
  }

  menuActive(value: number) {
    this.menu_active = value;
    this.hamberger = false;
    this.hambergerOutside = false;
  }

  showAuth() {
    if (this.show_auth == false) {
      this.show_auth = true;
      setTimeout(() => {
        this.show_auth_outside = true;
      }, 50);
    }
    else {
      this.show_auth = false;
      this.show_auth_outside = false;
    }
  }

  handleClickOutsideFiltre() {
    if (this.show_auth_outside == true) {
      this.show_auth = false;
      this.show_auth_outside = false;
    }
  }

  affHamberger() {
    if (this.hamberger == false) {
      this.hamberger = true;
      setTimeout(() => {
        this.hambergerOutside = true;
      }, 50);
    }
    else {
      this.hamberger = false;
      this.hambergerOutside = false;
    }
  }

  handleClickOutsideHamberger() {
    if (this.hambergerOutside == true) {
      this.hamberger = false;
      this.hambergerOutside = false;
    }
  }





}
