import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class DonateComponent implements OnInit {

  constructor( private router: Router  ) {}

  ngOnInit(): void {
    console.log(localStorage.getItem('donate_receiver')!);
    
  }

  donateType(type : number) {
    if(type == 1){
      // this.router.navigate(['/user/donate/monetaires']);
    }
    else if(type == 4){
      // this.router.navigate(['/user/donate/benevole']);
    }
    else {
      localStorage.setItem('donate_type', type.toString());
      this.router.navigate(['/user/donate/create']);
    }
  }
  
}
