import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit {

  constructor( private router: Router ) {}

  ngOnInit(): void {
  
  }

  connexionEmail(){
    this.router.navigate(['auth/login/email']);
  }

  register(){
    this.router.navigate(['auth/register']);
  }
  
}
