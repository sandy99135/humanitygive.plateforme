
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Dictionnaire } from 'src/app/dictionnaire/dictionnaire';
import { Donate } from 'src/app/models/donate.model';
import { DonateService } from 'src/app/services/donate.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})

export class DonateEditComponent implements OnInit {

  dictionnaire = new Dictionnaire();
  user_pricipal !: any;
  profil_view !: any;
  donate_receiver !: string;
  detail!: any;
  name !: string;
  quantity !: number;

  panier: any[] = [
  ];
  donate_id !: string;
  donate_type !: number;
  id_receiver !: string;
  id_giver !: string;
  processus_active!: number;
  processus_date!: string | Date;
  processus_start_heure!: number;
  processus_start_minute!: number;
  processus_end_heure!: number;
  processus_end_minute!: number;
  processus_start_heure_ass!: string;
  processus_end_heure_ass!: string;
  processus_number: string = "";
  processus_number_ass: string = "";
  processus_adresse_giver: string = "";
  processus_adresse_receiver: string = "";

  panier_error: boolean = false;
  error!: string | null;
  succes!: string | null;
  donate_form!: FormGroup;
  loading_update: boolean = false;
  isUpdate !: boolean;
  update_donate_detail !: any;
  update_donate_id !: string;

  constructor(private router: Router, private donateService: DonateService, private route: ActivatedRoute) {
    new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'qualite': new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }

  ngOnInit(): void {
    this.detail = JSON.parse(localStorage.getItem('donate_detail')!);
    this.user_pricipal = JSON.parse(localStorage.getItem('user')!)
    this.params(this.detail);

    console.log(this.detail);
    console.log(this.user_pricipal);
  }

  params(detail: any) {
    this.donate_id = detail.id;
    this.donate_type = detail.type;
    this.id_giver = this.user_pricipal.type == 1 ? this.user_pricipal.id : detail.giver.id;
    this.id_receiver = detail.receiver.id;
    this.panier = detail.don;
    this.processus_active = detail.deliveryType;
    this.processus_date = detail.deliveryType == 1 ?  new Date(detail.deliveryDate).toISOString().split('T')[0] : new Date();
    this.processus_number = detail.contact;
    if (detail.deliveryType == 1) {
      this.processus_adresse_giver = (detail.place).split(/null|null,|, null/g).join('');
      this.processus_adresse_receiver = detail.receiver.adresse;
      this.processus_number = this.user_pricipal.phoneNumber;
    }
    else {
      this.processus_adresse_receiver = (detail.place).split(/null|null,|, null/g).join('');
      this.processus_adresse_giver = this.user_pricipal.addresse;
      this.processus_number_ass = detail.contact;
    }

    if(detail.deliveryType == 1){
      let startHours = detail.startHours.split(":");
      let endHours  = detail.endHours.split(":");
      this.processus_start_heure = startHours[0];
      this.processus_start_minute = startHours[1];
      this.processus_end_heure = endHours[0] ;
      this.processus_end_minute = endHours[1];
    }
    else{
      this.processus_start_heure_ass = detail.startHours ;
      this.processus_end_heure_ass = detail.endHours ;
    }
    

  }

  addPanier() {
    if (!this.name || !this.quantity) {
      this.panier_error = true;
    }
    else {
      this.panier_error = false;
      this.panier = [{ name: this.name, quantity: this.quantity }, ...this.panier];
      console.log(this.panier);
    }
  }

  move(e: any, p: any, c: any, n: any) {
    let length = c.value.length;
    let maxlength = c.getAttribute('maxlength');
    if (length == maxlength) {
      if (n !== "") {
        n.focus();
      }
    }
    // if(e.key === "Backspace"){
    //   if(p !== ""){
    //     p.focus();
    //   }
    // }
  }

  prepareData() {
    let startHours = '' + this.processus_start_heure + ':' + this.processus_start_minute + '';
    let endHours = '' + this.processus_end_heure + ':' + this.processus_end_minute + '';

    let donate = this.detail;
    donate.giver = this.id_giver;
    donate.receiver = this.id_receiver;
    donate.deliveryDate = this.processus_date || "";
    donate.startHours = this.processus_active == 1 ? startHours : "09:01";
    donate.endHours = this.processus_active == 1 ? endHours : "16:15";
    donate.contact = this.processus_active == 1 ? this.processus_number.toString() : this.processus_number_ass.toString();
    donate.place = this.processus_active == 1 ? this.processus_adresse_giver : this.processus_adresse_receiver;
    donate.don = this.panier;
    donate.need = uuidv4();
    if(this.detail.donateTracking == null) donate.donateTracking = {
      "isDeliveryConfirmGiver": false,
      "isDeliveryConfirmReceiver": false
    }
    
    return donate;
  }

  delete(index: number) {
    this.panier.splice(index, 1);
  }

  updateSubmit() {
    this.loading_update = true;
    this.error = null

    let update_donate = this.prepareData()
    console.log(update_donate);

    this.donateService.updateDonate(update_donate).subscribe({
      next :(data) => {
        this.loading_update = false;
      }
      ,
      error : (error) => {
        console.log(error)
        if (error.status == 200) {
          this.error = null
          this.succes = "Votre don a été mis a jour ! "
          setTimeout(() => {
            this.router.navigate(['/user/activite/donate']);
          }, 1000);

        }
        else {
          this.error = "Une erreur s'est produit"
        }
        this.loading_update = false;
      }
    });
  }

  validation_Submit(type: string) {
    this.succes = null;
    this.error = null
    if (this.panier.length == 0) {
      this.error = "Vous n'avez pas ajouter don dans le panier"
    }
    else if (this.processus_active == null) {
      this.error = "Veuillez selectionner la processus de livraison qui vous convient"
    }
    else if (this.processus_active == 1) {
      if (this.processus_date == null) {
        this.error = "Veuillez selectionner une date pour le ramassage du don"
      }
      else if (this.processus_start_heure == null || this.processus_start_minute == null) {
        this.error = "Veuillez selectionner l'heure et minute pour ramassage"
      }
      else if (this.processus_number == null) {
        this.error = "Le numero de contacte est obligatoire"
      }
      else if ((this.processus_number).toString().length != 9) {
        this.error = "Le numéro de téléphone doit comporté 10 caracteres"
      }
      else {
        this.updateSubmit();
      }
    }
    else {
      this.updateSubmit();
    }
  }
}