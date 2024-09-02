import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResetMdp } from 'src/app/models/compte';
import { ContacteModel } from 'src/app/models/contacte.model';
import { Token } from 'src/app/models/token';
import { CompteService } from 'src/app/services/compte.service';
import { ContacteService } from 'src/app/services/contacte.service';
import { DetailsService } from 'src/app/services/details.service';
import { LoginService } from 'src/app/services/login.service';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss'],
})
export class CompteComponent implements OnInit {
  details !: any;
  user!: any;
  setting: number = 0;

  amelioration!: string;
  email!: string;
  phone !: any;
  mdp: any = {
    actuel: '',
    nouveau: '',
    confirme: ''
  }

  mdp_oublie: any = {
    actuel: '',
    nouveau: '',
    confirme: ''
  }
  mdpValidation: boolean = false;
  compte: any = {
    desactiver: false,
    supprimer: false,
  }
  sup_desactive_mdp!: string;
  sup_desactive_error: boolean = false;

  loading_amelioration: boolean = false;
  loading_denomination: boolean = false;
  loading_notification: boolean = false;
  loading_mdp: boolean = false;
  loading_mdp_oublie: boolean = false;
  loading_compte: boolean = false;

  modalCompte: boolean = false;
  deno_succes !: string;
  deno_error!: string;
  noti_succes !: string;
  noti_error!: string | null;
  mdp_succes !: string;
  mdp_error!: string
  mdp_oublie_succes !: string;
  mdp_oublie_error!: string

  eyes_1: boolean = false;
  eyes_2: boolean = false;
  eyes_a: boolean = false;
  eyes_b: boolean = false;

  error_amelioration_message !: string | null;
  succes_amelioration_message!: string | null;
  constructor(
    private router: Router,
    private authService: LoginService,
    private compteService: CompteService,
    private registerService: RegisterService,
    private detailsService: DetailsService,
    private contacteMessage: ContacteService) { }



  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!)
    console.log(this.user);
    this.getDetails(this.user.id)
  }

  getDetails(id: string) {
    if (this.user.type == 1) {
      this.detailsService.getGiverDetailById(id, this.user.isProfessional).subscribe((response) => {
        this.details = response;
        console.log(response);
      });
    }
    else {
      this.detailsService.getUserDetailById(id).subscribe((response) => {
        this.details = response;
        console.log(response);
      });
    }
  }

  retour() {
    this.setting = 0
  }

  updateStorage() {
    localStorage.setItem('user', JSON.stringify(this.user).toString());
  }

  deconnexion() {
    localStorage.clear();
    this.router.navigate(['/auth/login/email']);
  }

  sendAmelioration() {
    this.error_amelioration_message = null;
    this.succes_amelioration_message = null;
    console.log(this.amelioration);
    if (this.amelioration.trim() === "") {
      this.error_amelioration_message = "Veuillez ecrire un message"
    }
    else {
      let message : string = "*Compte : " + (this.user.type == 1 ? "Giver" : "Receiver" ) + 
                             " *Status : " + (this.user.isProfessional ? "Professionnel" : "Particulier") +  
                             " *From Amelioration Plateform : " + this.amelioration
      let data: ContacteModel = {
        fullName: this.user.fullName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        message: message
      }
    this.ameliorationMessage(data)
    }
  }

  ameliorationMessage(data :  ContacteModel) {
    
    console.log("amelioration :" + data);
    this.loading_amelioration = true;
    this.contacteMessage.addContacteMessage(data).subscribe({
      next :(data) => { console.log(data); }
      ,
      error : (error) => {
        console.log(error)
        if (error.status == 200) {
          this.succes_amelioration_message = "Votre message a été bien envoyé";
          setTimeout(() => {
            this.retour()
          }, 3000);
        }
        else {
          this.succes_amelioration_message = "Une erreur s'est produit au niveau du serveur , veuillez réesayer " ;
        }
        this.loading_amelioration = false;
      }
    });
  }

  changeDenomination() {
    this.loading_denomination = true;
    this.details.fullName = this.user.fullName;
    this.detailsService.updateReceiverMixte(this.details).subscribe(
      (response) => { this.loading_denomination = false; },
      (error) => {
        console.log(error)
        error.status == 200 ? this.deno_succes = "Votre Dénomination a été bien modifié ! " : this.deno_error = "Une erreur interne s'est produite";
        error.status == 200 ? this.updateStorage() : null;
        this.loading_denomination = false;
      }
    );
  }

  changeEmailAndNumber() {
    this.details.email = this.user.email;
    this.details.phoneNumber = this.user.phoneNumber ? (this.user.phoneNumber)!.toString() : "";
    console.log(this.details);

    if (this.user.phoneNumber !== null) {
      if ((this.user.phoneNumber).toString().length != 9) {
        this.noti_error = "Le numéro de téléphone doit comporté 10 caracteres"
        return
      }
      else {
        this.loading_notification = true;
        if (this.user.type == 1) {
          !this.user.isProfessional ? this.updateParticularGiver() : this.updateProGiver();
        }
        else {
          this.updateReceicer()
        }
      }
    }
    else {
      console.log(this.user.phoneNumber);
      this.noti_error = "Le numéro de téléphone est obligatoire"
    }

  }

  updateReceicer() {
    this.detailsService.updateReceiverMixte(this.details).subscribe({
      next :(response) => { this.loading_notification = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.noti_succes = "Vos Informations ont été bien modifiés ! "
          this.noti_error = null
          this.updateStorage()
        }
        else {
          this.noti_error = "Une erreur interne s'est produite"
        }
        this.loading_notification = false;
      }
    });
  }

  updateParticularGiver() {
    this.detailsService.updateParticularGiver(this.details).subscribe({
      next :(response) => { this.loading_notification = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.noti_succes = "Vos Informations ont été bien modifiés ! "
          this.noti_error = null
          this.updateStorage()
        }
        else {
          this.noti_error = "Une erreur interne s'est produite"
        }
        this.loading_notification = false;
      }
    });
  }

  updateProGiver() {
    this.details.isProfessional = true;
    this.detailsService.updateProGiver(this.details).subscribe({
      next : (response) => { this.loading_notification = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.noti_succes = "Vos Informations ont été bien modifiés ! "
          this.noti_error = null
          this.updateStorage()
        }
        else {
          this.noti_error = "Une erreur interne s'est produite"
        }
        this.loading_notification = false;
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

  changeMdp() {
    this.loading_mdp = true;
    let data: ResetMdp = {
      id: this.user.id,
      email: this.user.email,
      actualPassord: this.mdp.actuel,
      newPassord: this.mdp.nouveau,
      confirmNewPassword: this.mdp.comfirme,
      isForgotten: false,
    }
    console.log(data);

    this.compteService.ResetPassword(data).subscribe({
      next :(data) => { this.loading_mdp = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.mdp_succes = "Votre mot de passe a été modifié ! "
          setTimeout(() => { this.setting = 0 }, 2000);
        }
        if (error.status == 400) {
          this.mdp_error = error.error
        }
        this.loading_mdp = false;
      }
    });
  }

  mdpOublie() {
    this.loading_mdp_oublie = true;
    this.registerService.otpGenerate(this.user.email).subscribe({
      next : (data) => { this.loading_mdp_oublie = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.setting = 41;
        }
        this.loading_mdp_oublie = false;
      }
    });
  }

  otpValidation(otp: any) {
    if (otp.otpVerify) this.setting = 42
  }

  resetMdpOublie() {
    this.loading_mdp = true;
    let data: ResetMdp = {
      id: this.user.id,
      email: this.user.email,
      actualPassord: '',
      newPassord: this.mdp_oublie.nouveau,
      confirmNewPassword: this.mdp_oublie.confirme,
      isForgotten: true,
    }
    console.log(data);

    this.compteService.ResetPassword(data).subscribe({
      next:(data) => { this.loading_mdp = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.mdp_oublie_succes = "Votre mot de passe a été modifié ! "
          // setTimeout(() => {this.setting = 0}, 2000);
        }
        if (error.status == 400) {
          this.mdp_oublie_error = error.error
        }
        this.loading_mdp = false;
      }
    });
  }

  monCompte() {
    console.log(this.compte);
    this.modalCompte = true;
  }

  supDesactiveCompte() {
    this.loading_compte = true
    this.sup_desactive_error = false;

    let dataLogin: any = {
      email: this.user.email,
      password: this.sup_desactive_mdp,
    }
    this.authService.authenticate(dataLogin).subscribe({
      next:(token: Token) => {
        //  console.log(token);
        if (token && token.token != "") {
          console.log("Votre compte a été Désactivé ou Supprimé");
          this.loading_compte = false;
        }
      },
     error :(error) => {
        this.loading_compte = false
        // console.log(error);
        this.sup_desactive_error = true;
      }
    });
  }

}