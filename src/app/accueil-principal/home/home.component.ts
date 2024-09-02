import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomePrincipalComponent implements OnInit {

  search_text !: string ;
  map !: string ;

  search_form!: FormGroup;
  search_error : boolean = false ;

  constructor( private router: Router  , private location: Location ) {
    this.search_form = new FormGroup({
      'search_text': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'map': new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  ngOnInit(): void {
    let token  = localStorage.getItem('token')!;
    let user = localStorage.getItem('user')!;
    let login = localStorage.getItem('login')!;
    if(token && user && login == 'true'){
      this.router.navigate(['/user/home']);
    }
  }

  search(){
    console.log(this.search_text);
    console.log(this.map);
    let search = {
      text : this.search_text ,
      map : this.map
    }
    if(this.search_text !== "" && this.map !== "" && this.search_text !== undefined && this.search_text!== undefined ){
      localStorage.setItem('search', JSON.stringify(search));
      this.router.navigate(['/recherche']);
    }
    else{
      this.search_error = true ;
    }
    
  }

}
