import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AssociationTeamInfo, DetailReceiverMixte } from 'src/app/models/ReceiverMixte.model';
import { RealisationData, RealisationRemove, RealisationUpdate } from 'src/app/models/realisation.model';
import { DetailsService } from 'src/app/services/details.service';
import { ImageService } from 'src/app/services/image.service';
import { RealisationService } from 'src/app/services/realisation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-realisation',
  templateUrl: './realisation.component.html',
  styleUrls: ['./realisation.component.scss'],
})
export class RealisationComponent implements OnInit {

  url : string = environment.URI + "/api/File/readImage?";

  id !: string;
  details ! : DetailReceiverMixte;
  
  myForm!: FormGroup;

  loading : boolean = true;
  loading_add : boolean = false ;
  loading_update : boolean = false ;
  loading_delete_index! : number | null;

  imageUrl !: string | ArrayBuffer | null | undefined ;
  imageSize !: number ;
  imageType! :  string ;
  maxSize : number = 1048576 ;

  update_realisation_index! : number ;
  realisation_titre! : string ;
  realisation_contenu ! : string ;

  error ! : string | null ;
  succes ! : string | null ;

  constructor( 
    private router: Router , 
    private detailsService :  DetailsService , 
    private realisationService :  RealisationService,
    private imageService :  ImageService
    ) {
    this.myForm = new FormGroup({
      realisation_image: new FormControl(),
      realisation_titre : new FormControl(),
      realisation_contenu: new FormControl(),
    });
  }

  ngOnInit(): void {
    let token  = localStorage.getItem('token')!;
    let user = JSON.parse(localStorage.getItem('user')!);
    this.id = user.id;
    this.getDetails(user.id);
  }

  getDetails(id : string){
    this.detailsService.getUserDetailById(id).subscribe((response) => {
        this.details = response ;
        console.log(this.details);
        this.loading = false;
    });
  }

  getImageUrl( name : string , type : string){
    return this.url + "fileName=" + name +"&type=" + type ;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.previewImage(file);
      this.imageSize = file.size
      this.imageType = file.type;
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
      this.imageUrl = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  succesRequest(message : string) {
    this.succes = message;
    setTimeout(() => {
      this.succes = null;
    }, 2000);
  }

  addRealisation(){
    const data = this.myForm.value;
    let realisation : RealisationData = {
      id: this.id,
      realisations: [
        {
          title: data.realisation_titre,
          description: data.realisation_contenu,
          photo: {
            value: this.imageUrl,
            type: this.imageType,
            categorie: "REALISATIONS_PICTURE"
          }
        }
      ]
    }
    console.log(realisation);
    this.save(realisation)
  }

  save(realisation : RealisationData) {
    this.error = null
    if ( !realisation.realisations[0].title || realisation.realisations[0].title == "") {
      this.error = "Titre obligatoire" ;
    } 
    else if (!realisation.realisations[0].description || realisation.realisations[0].description == "") {
      this.error = "Contenu obligatoire" ;
    } 
    else if (!this.imageUrl) {
      this.error = "Veuillez Selectionner une image" ;
    } 
    else {
      this.error = null ;
      this.loading_add = true ;
      this.realisationService.addRealisation(realisation).subscribe({
        next :(response) => {
          console.log(response);
          this.loading_add = false ;
       }
       ,
       error :(error) =>{
         console.log(error)
         if(error.status == 200){
          this.getDetails(this.id);
          this.succesRequest("Réalisation ajouté avec succes")
         }
         else {
          this.error = error.message;
         }
         this.loading_add = false ;
       }
      });
    }
  }

  
  deleteRealisation(index:number){
    // this.details.realisations.splice(index, 1);
    this.loading_delete_index = index ;

    let remove : RealisationRemove = {
      id: this.id  ,
      idRealisation: this.details.realisations[index].id,
    }
    console.log(remove);
    this.realisationService.removeRealisation(remove).subscribe({
      next : (response) => {console.log(response);} ,
      error :(error) =>{
        console.log(error)
        if(error.status == 200){
         this.details.realisations.splice(index, 1);
         this.succesRequest("Votre réalisation a été bien supprimé")
        }
        this.loading_delete_index = null ;
      }
    });
  }

  async choseRealisation(index:number){
    let target = this.details.realisations[index] ;
    this.update_realisation_index = index ;
    this.realisation_titre = target.title;
    this.realisation_contenu = target.description;
    this.imageUrl = await this.imageService.convertImageUrlToBase64(this.getImageUrl( target.photo.name, target.photo.type)) ;
    this.imageType = target.photo.type;
  }

  updateRealisation(){
    const data = this.myForm.value;

    let update : RealisationUpdate = {
      id: this.details.realisations[this.update_realisation_index].id ,
      title: data.realisation_titre ,
      description: data.realisation_contenu,
      photo: {
        value: this.imageUrl,
        type: this.imageType,
        categorie: "REALISATIONS_PICTURE"
      }
    }
    console.log(update); 

    if ( !update.title || update.title == "") {
      this.error = "Titre obligatoire" ;
    } 
    else if (!update.description || update.description == "") {
      this.error = "Contenu obligatoire" ;
    } 
    else if (!this.imageUrl) {
      this.error = "Veuillez Selectionner une image" ;
    } 
    else {
      this.error = null ;
      this.loading_update = true ;
      this.realisationService.updateRealisation(update).subscribe({
        next :(response) => {console.log(response); this.loading_update = false ;} ,
        error :(error) =>{
          console.log(error)
          if(error.status == 200){
            // update formilaire visible
            this.succesRequest("Votre réalisation a été bien mis a jour");
            this.details.realisations[this.update_realisation_index] = {
              title: this.realisation_titre,
              description: this.realisation_contenu
            }
          }
          this.loading_update = false ;
        }
      });
    }
  }

  saveUpdate() {
    
  }


  retour(){
    this.router.navigate(['/user/profile']);
  }

}