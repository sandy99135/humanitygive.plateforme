import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  user! : any ;
  constructor( private router: Router ) {}

  ngOnInit(): void {
    let token  = localStorage.getItem('token')!;
    this.user = JSON.parse(localStorage.getItem('user')!)
    console.log(this.user);
    // if(!token && this.user == undefined){
    //   this.router.navigate(['/auth/login/email']);
    // }
    
  }

  
}