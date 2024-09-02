import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Dictionnaire } from 'src/app/dictionnaire/dictionnaire';
import { Donate } from 'src/app/models/donate.model';
import { DonateService } from 'src/app/services/donate.service';

@Component({
  selector: 'app-donate-creat',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class DonateCreatComponent implements OnInit {

  dictionnaire = new Dictionnaire();

  user_pricipal !: any;
  profil_view !: any;
  donate_receiver !: string;
  donate_type !: number;

  name !: string;
  quantity !: number;

  panier: any[] = [
    // { name: "Sac de riz", quantity: 5 },
    // { name: "Bouteille d'huile", quantity: 10 },
    // { name: "Chaize", quantity: 10 }
  ];

  id_receiver !: string ;
  id_giver !: string ;
  processus_active!: number;
  processus_date!:  string | Date;
  processus_start_heure!: number;
  processus_start_minute!: number;
  processus_end_heure!: number;
  processus_end_minute!: number;
  processus_number: string = "";
  processus_number_ass: string = "";
  processus_adresse_giver : string ="";
  processus_adresse_receiver : string =""; 

  panier_error: boolean = false;
  error!: string | null;
  succes!: string | null;

  donate_form!: FormGroup;

  loading_donate: boolean = false;

  isUpdate !: boolean;
  update_donate_detail !: any;
  update_donate_id !: string ;

  constructor(private router: Router, private donateService: DonateService, private route: ActivatedRoute) {
    new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'qualite': new FormControl('', [Validators.required, Validators.minLength(3)]),
    })
  }

  ngOnInit(): void {
    this.donate_type = parseInt(localStorage.getItem('donate_type')!);
    this.user_pricipal = JSON.parse(localStorage.getItem('user')!)
    this.profil_view = JSON.parse(localStorage.getItem('profil_view')!);
    
    
    this.id_receiver = this.profil_view.id;
    this.processus_adresse_giver = this.user_pricipal.addresse;
    this.processus_adresse_receiver = this.profil_view.addresse;
    this.processus_number = this.user_pricipal.phoneNumber;
    this.processus_number_ass = this.profil_view.phoneNumber;

    console.log(this.donate_receiver);
    console.log(this.donate_type);
    console.log(this.user_pricipal);
    console.log(this.profil_view);

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

  validation_Submit(type : string) {
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
        this.submit() 
      }
    }
    else {
      this.submit() ;
    }
  }

  prepareData(){
    // let profil_place = '' + this.profil_view.addresse + ' , ' + this.profil_view.fokotany + ' , ' + this.profil_view.commune + ' , ' + this.profil_view.district + ' , ' + this.profil_view.region + ''
    let startHours = '' + this.processus_start_heure + ':' + this.processus_start_minute + '';
    let endHours = '' + this.processus_end_heure + ':' + this.processus_end_minute + '';

    let donate: Donate = {
      giver: this.user_pricipal.id,
      receiver: this.id_receiver,
      type: this.donate_type,
      deliveryType: this.processus_active,
      deliveryDate: this.processus_active == 1 ? this.processus_date : new Date(),
      startHours: this.processus_active == 1 ? startHours : "09:01",
      endHours: this.processus_active == 1 ? endHours : "16:15",
      contact: this.processus_active == 1 ? this.processus_number : this.processus_number_ass,
      place: this.processus_active == 1 ? this.processus_adresse_giver : this.processus_adresse_receiver,
      don: this.panier,
    }

    return donate ;
  }


  submit() {
    let donate = this.prepareData()
    console.log(donate);

    this.loading_donate = true;
    this.error = null
    this.donateService.addDonate(donate).subscribe({
      next :(data) => {
        this.loading_donate = false;
      }
      ,
      error : (error) => {
        console.log(error)
        if (error.status == 200) {
          this.error = null
          this.succes = "Votre don a été prise en charge , les responsable passeront pour xxxxxxxx xxx "
          setTimeout(() => {
            this.router.navigate(['/user/activite/donate']);
          }, 1000);

        }
        else {
          this.error = "Une erreur s'est produit"
        }
        this.loading_donate = false;
      }
    });
  }

  delete(index: number) {
    this.panier.splice(index, 1);
  }


  

}