import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { RegisterService } from 'src/app/services/register.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetMdp } from 'src/app/models/compte';
import { CompteService } from 'src/app/services/compte.service';

@Component({
    selector: 'app-forgot-mdp',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.scss'],
})
export class ForgotMdpComponent implements OnInit {

    forgotForm!: FormGroup;
    email !: string;
    etape: number = 1;
    loading_mdp_oublie: boolean = false;
    loading_mdp: boolean = false;
    forgotError !: string | null;
    mdp_oublie_succes !: string;
    mdp_oublie_error!: string
    mdpValidation: boolean = false;
    mdp_oublie: any = {
        actuel: '',
        nouveau: '',
        confirme: ''
    }
    eyes_1: boolean = false;
    eyes_2: boolean = false;
    eyes_a: boolean = false;
    eyes_b: boolean = false;

    constructor(
        private router: Router,
        private location: Location,
        private compteService: CompteService,
        private registerService: RegisterService,
    ) {
        this.forgotForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
        });
    }

    ngOnInit(): void {

    }

    mdpOublie() {
        this.forgotError = null;
        this.loading_mdp_oublie = true;
        if (this.forgotForm.valid) {
            let email = this.forgotForm.value.email;
            this.email = email;
            console.log(email);

            this.loading_mdp_oublie = true;
            this.registerService.otpGenerate(email).subscribe({
                next : (data) => { this.loading_mdp_oublie = false; },
                error :(error) => {
                    console.log(error)
                    if (error.status == 200) {
                        localStorage.setItem('inconnu_user', JSON.stringify({
                            email: email
                        }).toString());
                        this.etape = 2;
                    }
                    else {
                        this.forgotError = error.error
                    }
                    this.loading_mdp_oublie = false;
                    this.loading_mdp_oublie = false;
                }
            });
        }
    }

    otpValidation(otp: any) {
        if (otp.otpVerify) this.etape = 3
    }

    resetMdpOublie() {
        this.loading_mdp = true;
        let data: ResetMdp = {
            id: "",
            email: this.email,
            actualPassord: '',
            newPassord: this.mdp_oublie.nouveau,
            confirmNewPassword: this.mdp_oublie.confirme,
            isForgotten: true,
        }
        console.log(data);

        this.compteService.ResetPassword(data).subscribe({
            next : (data) => { this.loading_mdp = false; },
            error : (error) => {
                console.log(error)
                if (error.status == 200) {
                    this.mdp_oublie_succes = "Votre mot de passe a été modifié ! "
                    setTimeout(() => { this.router.navigate(['/auth/login/email']) }, 2000);
                }
                if (error.status == 400) {
                    this.mdp_oublie_error = error.error
                }
                this.loading_mdp = false;
            }
        });
    }

    validationMdp(data: any) {
        this.mdpValidation = true;
        let value = data.target.value;
        // var Reg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
        var Reg = new RegExp(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
        if (Reg.test(value)) {
            this.mdpValidation = false;
        }
    }

    retour() {
        this.etape > 1 || this.etape > 1 ? this.etape-- : this.router.navigate(['/auth/login/email']);
    }
}
