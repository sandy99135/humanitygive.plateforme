import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AssociationTeamInfo, DetailReceiverMixte } from 'src/app/models/ReceiverMixte.model';
import { DetailsService } from 'src/app/services/details.service';

@Component({
  selector: 'app-ajout-edit',
  templateUrl: './ajout-edit.component.html',
  styleUrls: ['./ajout-edit.component.scss'],
})
export class AjoutEditComponent implements OnInit {

  id !: string;
  details ! : DetailReceiverMixte;
  user : any ;
  myForm!: FormGroup;
  loading : boolean = true;
  loading_update : boolean = false ;
  error : boolean = false ;

  update_realisation_index! : number ;
  realisation_titre! : string ;
  realisation_contenu ! : string ;

  constructor( private router: Router , private detailsService :  DetailsService) {
    this.myForm = new FormGroup({
      mission: new FormControl(),

      responsable: new FormControl(),
      nb_equipe: new FormControl(),
      nb_charge: new FormControl(),
      nb_implantation: new FormControl(),
      x_parraigne: new FormControl(),
      autre: new FormControl(),
      nb_autre: new FormControl(),

      // need: new FormControl(),
      biography: new FormControl(),
      realisation_image: new FormControl(),
      realisation_titre : new FormControl(),
      realisation_contenu: new FormControl(),
    });
  }

  ngOnInit(): void {
    let token  = localStorage.getItem('token')!;
    let user = JSON.parse(localStorage.getItem('user')!);
    this.user = user ;
    this.id = user.id;
    this.getDetails(user.id);
  }

  getDetails(id : string){
    if(this.user.type == 1){
      this.detailsService.getGiverDetailById(id , this.user.isProfessional).subscribe((response) => {
        this.details = response;
        console.log(this.details);
        this.loading = false;
      });
    }
    this.detailsService.getUserDetailById(id).subscribe((response) => {
        this.details = response ;
        console.log(this.details);
        this.loading = false;
        if(this.details.associationTeamInfo == null) {
          this.details.associationTeamInfo = {
            "headFullname" : "",
            "teamNumber" : 0,
            "chargeNumber" : 0,
            "implantationNumber" : 0,
            "number" : 0 ,
            "content": "" ,
            "state" : "",
            "place" : ""
            }
        }
    });
  }

  addRealisation(){
    const data = this.myForm.value;
    if(data.realisation_titre.length >= 1 || data.realisation_contenu.length >= 1){
      this.details.realisations.unshift(
        {
          title: data.realisation_titre,
          description: data.realisation_contenu
        }
      );
      console.log(this.details);
    }
  }

  deleteRealisation(index:number){
    console.log(index);
    this.details.realisations.splice(index, 1);
  }

  choseRealisation(index:number){
    this.update_realisation_index = index ;
    this.realisation_titre = this.details.realisations[index].title;
    this.realisation_contenu = this.details.realisations[index].description;
  }

  updateRealisation(){
    const data = this.myForm.value;
    this.details.realisations[this.update_realisation_index] = {
        title: this.realisation_titre,
        description: this.realisation_contenu
      }
    console.log(this.details);
    
  }

  saveUpdate() {
    this.loading_update = true ;
    const data = this.myForm.value;
    console.log(data);
    this.formatData(data);
    console.log('update : ' , this.details);
    this.error = false ;
    if(this.user.type == 1){
      !this.user.isProfessional ? this.updateParticularGiver() : this.updateProGiver() ;
    }
    else {
      this.updateReceicer() ;
    }
  }

  formatData(data : any){
    this.details.mission = data.mission;
    this.details.associationTeamInfo = {
      headFullname: data.responsable,
      teamNumber: data.nb_equipe != null ? data.nb_equipe : 0 ,
      chargeNumber: data.nb_charge != null ? data.nb_charge : 0 ,
      implantationNumber: data.nb_implantation != null ? data.nb_implantation : 0 ,
      number: data.x_parraigne != null ? data.x_parraigne : 0 ,
      place: "",
      content: data.autre,
      state:  data.nb_autre != null ?  data.nb_autre.toString() : "0"
    }
    this.details.biography = data.biography;
    
  }

  updateReceicer(){
    this.detailsService.updateReceiverMixte(this.details).subscribe({
      next : (response) => {
        console.log(response);
     }
     ,
     error :(error) =>{
       console.log(error)
       if(error.status == 200){
         this.getDetails(this.id);
         this.router.navigate(['/user/profile']);
       }
       else{this.error = true}
       this.loading_update = false ;
     }
    });
  }

  updateParticularGiver(){
    this.detailsService.updateParticularGiver(this.details).subscribe({
      next : (response) => {
        console.log(response);
     }
     ,
     error : (error) =>{
       console.log(error)
       if(error.status == 200){
         this.getDetails(this.id);
         this.router.navigate(['/user/profile']);
       }
       else{this.error = true}
       this.loading_update = false ;
     }
    });
  }

  updateProGiver(){
    this.details.isProfessional = true;
    this.detailsService.updateProGiver(this.details).subscribe({
      next : (response) => {
        console.log(response);
     }
     ,
     error : (error) =>{
       console.log(error)
       if(error.status == 200){
         this.getDetails(this.id);
         this.router.navigate(['/user/profile']);
       }
       else{this.error = true}
       this.loading_update = false ;
     }
    });
  }

  retour(){
    this.router.navigate(['/user/profile']);
  }

}