import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-register-tunnel',
  templateUrl: './tunnel.component.html',
  styleUrls: ['./tunnel.component.scss'],
})
export class RegisterTunnelComponent implements OnInit {

  register! : any;

  constructor( private router: Router ) {
  }

  ngOnInit(): void {
    this.register = JSON.parse(localStorage.getItem('register')!);
    localStorage.setItem('tunnel', JSON.stringify({"etape" : 0}));
  }

  tunnel(cible : string , compte : number){
    this.register.compte = compte ;
    localStorage.setItem('register', JSON.stringify(this.register));
    this.router.navigate(['auth/register/tunnel/'+ cible]);
  }
  
}
