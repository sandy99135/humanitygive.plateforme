import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

import { Dictionnaire } from 'src/app/dictionnaire/dictionnaire';
import { DonateService } from 'src/app/services/donate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'view-donate-activite',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class ActiviteDonateViewComponent implements OnInit {

  url : string = environment.URI + "/api/File/readImage?";
  dictionnaire = new Dictionnaire();
  profil_view !: any;
  data: any;
  user: any;
  processus !: string | undefined;

  receiver_id !: string;
  giver_id !: string;

  loading_isDelivery : boolean = false ;
  loading_delete: boolean = false;
  error_delete !: boolean;
  error_isDelivery !: boolean;

  modal_delete: boolean = false;
  modal_delivery: boolean = false;
  // panier : any[] = [
  //   {designation : "Sac de riz" , quantite : 5},
  //   {designation : "Bouteille d'huile" , quantite : 10},
  //   {designation : "Chaize" , quantite : 10}
  // ] ;

  constructor(private router: Router, private donateService: DonateService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!)
    this.data = JSON.parse(localStorage.getItem('donate_detail')!);
    this.data.state === "NEW" ? this.data.state = "en cours" : null;
    this.processus = this.deliveryType(this.data.deliveryType)

    console.log(this.data);
    console.log(this.data);
  }
  
  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name +"&type=" + type ;
  }

  changeDetail(value: number) {
    this.profil_view = JSON.parse(localStorage.getItem('profil_view')!);
  }

  deliveryType(type: number): string | undefined {
    let processus;
    type == 1 && this.user.type == 1 ? processus = "Récupérer chez moi" :
      type == 2 && this.user.type == 1 ? processus = "Livrer moi-meme" : null
    type == 1 && this.user.type !== 1 ? processus = "Récupérer chez le donneur" :
      type == 2 && this.user.type !== 1 ? processus = "Livrer chez moi" : null

    return processus
  }

  update() {
    this.router.navigate(['/user/donate/edit']);
  }

  delete() {
    this.loading_delete = true;
    this.error_delete = false;
    this.donateService.setStatus(this.data.id, 'annulé').subscribe(
      (data) => {
        console.log(data);
        this.loading_delete = false;
      }
      ,
      (error) => {
        console.log(error)
        if (error.status == 200) {
          this.data.state = "annulé"
          this.modal_delete = false;
          setTimeout(() => {
            this.router.navigate(['/user/activite/donate']);
          }, 1000);
        }
        else {
          this.error_delete = true;

        }
        this.loading_delete = false;
      });
  }

  pepars_receiver_giver_id() {
    if(this.user.type == 1){
      this.giver_id = this.user.id;
      this.receiver_id = this.data.receiver.id ;
    }
    else{
      this.receiver_id = this.user.id;
      this.giver_id = this.data.giver.id ;
    }
    // Le payload api doit avoir --> giver : "id_valeur" et receiver : "id_valeur"
    
  }

  DeliveryConfirm() {
    this.pepars_receiver_giver_id();
    this.loading_isDelivery = true ;

    let update_data = this.data;
    update_data.donateTracking =  {
      isDeliveryConfirmGiver: false,
      isDeliveryConfirmReceiver: false
    }
    this.user.type == 1 ?  update_data.donateTracking.isDeliveryConfirmGiver = true :  update_data.donateTracking.isDeliveryConfirmReceiver = true ;
    update_data.donateTracking.isDeliveryConfirmGiver && !update_data.donateTracking.isDeliveryConfirmReceiver ? update_data.state = "Attente de comfirmation" : null ;
    !update_data.donateTracking.isDeliveryConfirmGiver && update_data.donateTracking.isDeliveryConfirmReceiver ? update_data.state = "Attente de comfirmation" : null ;  
    update_data.need = uuidv4();
    update_data.giver = this.giver_id;
    update_data.receiver = this.receiver_id ;

    console.log(update_data);
    
    this.donateService.updateDonate(update_data).subscribe(
      (data) => {} ,
      (error) => {
        console.log(error) ;
        if(error.status == 200){
          this.modal_delivery = false
          update_data.donateTracking.isDeliveryConfirmGiver && update_data.donateTracking.isDeliveryConfirmReceiver ? update_data.state = "Livré" : null ; 
        }
        else {
          this.error_isDelivery = true ; 
        }
        this.loading_isDelivery = false ;
      });
  }

  getById(id:string){
    this.donateService.getByGiverId(id).subscribe((data: any) => {
      // this.data = data;
      console.log(data);
    });
  }

}