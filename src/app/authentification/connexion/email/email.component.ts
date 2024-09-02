import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { Token } from '../../../models/token';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-connexion-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class ConnexionEmailComponent implements OnInit {

  email!: string;
  mdp!: string;
  erreur: string = '';
  showPassword : boolean = false;
  utilisateur !: any;
  souvenir : boolean = false ;
  
  subscription : Subscription  = new Subscription();
  loading : boolean = false ;

  login_form!: FormGroup;

  constructor( 
    private router: Router,
    public authService: LoginService, 
    private registerService : RegisterService
    ) {
      this.login_form = new FormGroup({
        'email': new FormControl('', [Validators.required, Validators.email]),
        'mdp': new FormControl('', [Validators.required, Validators.minLength(3)]),
      });
    }

  ngOnInit(): void {
    
  }

  connexion() {
     this.router.navigate(['/user/home'])
  }

  showMyPassword() {
    this.showPassword = ! this.showPassword ;
 }

 sesouvenir() {
  this.souvenir = ! this.souvenir ;
 }

 submit() {
    console.log(this.email , this.mdp , this.souvenir);
    this.validationFront(this.email);
    this.loading = true ;
    let dataLogin : any = {
      email : this.email,
      password : this.mdp ,
    }
    this.authService.authenticate(dataLogin).subscribe({
      next : (token:Token) => {
        //  console.log(token);
         if(token && token.token != ""){

          localStorage.setItem('token',token.token);
          localStorage.setItem('user',JSON.stringify(token.user).toString());
          localStorage.setItem('login', 'true');

          let view_profil_id =  localStorage.getItem('view_profil_id')!;
          // Si view_profil existe rectirect vers view-profil 
          if(view_profil_id && view_profil_id !== ""){
            console.log(view_profil_id);
            this.router.navigate(['/user/profil-view']);
            localStorage.removeItem('view_profil_id');
          }
          else {
            console.log(token);
            this.router.navigate(['/user/home/association']);
          }
         }
      }
      ,
      error : (error) =>{
        console.log(error);
        if(error.error.token && !error.error.isValid){
          this.erreur = "Veuillez valider votre compte";
          localStorage.setItem('token',error.error.token);
          localStorage.setItem('user',JSON.stringify(error.error.user).toString());
          localStorage.setItem('expiration',error.error.expiration);
          localStorage.setItem('refreshToken',error.error.refreshToken);
          localStorage.setItem('login', 'false');

          this.registerService.otpGenerate(error.error.user.email).subscribe(
            (data) => {
               console.log(data);
            }
            ,
            (error) =>{
              console.log(error)
              if(error.status == 200){
                setTimeout(() => {
                  this.router.navigate(['/auth/otp']);
                }, 1000);
              }
            }
          );
        }
        else{
          this.erreur = "Une s'est produit sur le serveur";
          // this.erreur = error.message;
          localStorage.clear();
        }
        this.loading = false ;
      }
    });
  }

  validationFront(email : string){
    this.erreur = "";
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(this.mdp == undefined || this.mdp.length == 0) {
      this.erreur = "Entrer votre mot de passe"
    }
    if(this.email == undefined || this.email.length == 0) {
      this.erreur = "Entrer votre email"
    }
    if (!email.match(validRegex)) {
      this.erreur = "Format email non valide"
    }
 }

  
}
