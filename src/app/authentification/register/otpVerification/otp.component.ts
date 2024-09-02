import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalisationService } from 'src/app/services/localisation.component';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-otp-register',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpVerificationComponent implements OnInit {
   
    otpget : any = [] ;
    loading : boolean = false ;
    loading_resend : boolean = false ;
    isVerify : boolean = false ;
    error : boolean = false;
    myForm!: FormGroup;
    email !: string ;
    resend_text : string = "RENVOYER LE CODE";

    constructor( private router: Router , private registerService : RegisterService) {
      this.myForm = new FormGroup({
        'txt1': new FormControl('', [Validators.required]),
        'txt2': new FormControl('', [Validators.required]),
        'txt3': new FormControl('', [Validators.required]),
        'txt4': new FormControl('', [Validators.required]),
      });
    }

    ngOnInit(): void {
        this.email = JSON.parse(localStorage.getItem('register')!).email;
    }

    move(e:any , p :any , c :any , n :any) {
        let length = c.value.length;
        let maxlength = c.getAttribute('maxlength');
        if(length == maxlength) {
          if(n!== ""){
            n.focus();
          }
        }
        if(e.key === "Backspace"){
          if(p !== ""){
            p.focus();
          }
        }
    }

    verify(){
      if (this.myForm.valid) {
        const dt= this.myForm.value;
        console.log(dt);
        let data = dt.txt1 + dt.txt2 + dt.txt3 + dt.txt4 
        console.log(data);
        this.verifyOtp(data , this.email);
      }
      this.loading = true ;
      
    }

    verifyOtp(otp : string , email : string) {
      this.registerService.otpValidation(otp , email).subscribe(
        (data) => {
           console.log(data);
        }
        ,
        (error) =>{
          console.log(error)
          this.error = error.message;
          this.loading = false ;
          if(error.status == 200){
            this.isVerify = true ;
            let token  = localStorage.getItem('token')!;
            let login = localStorage.getItem('login')!
            if(token && login == 'false'){
              setTimeout(() => {
                this.router.navigate(['/user/home']);
              }, 3000);
            }
            else{
              setTimeout(() => {
                this.router.navigate(['/auth/login/email']);
              }, 3000);
            }
          }
        }
      );
    }

    resend() {
      this.error = false ;
      this.loading_resend = true ;
      this.registerService.otpGenerate( this.email).subscribe({
        next : (data) => {
          console.log(data);
       }
       ,
       error : (error) =>{
         console.log(error)
         if(error.status == 200){
           this.loading_resend = false ;
           this.resend_text = "CODE ENVOYE AVEC SUCCES";
           setTimeout(() => {
             this.resend_text = "RENVOYER LE CODE";
           }, 5000);
         }
       }
      });
    }
}