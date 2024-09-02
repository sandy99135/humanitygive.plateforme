import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-need-creat',
  templateUrl: './need.component.html',
  styleUrls: ['./need.component.scss'],
})
export class NeedCreatComponent implements OnInit {

  imagePreviews: { src: string, name: string, size: number }[] = [];
  localPictures : {value : any , type: string , categorie : string , fileName ? : string }[] = [];
  loading_local_pictures : boolean = false ;
  error_localPictures : boolean = false ;

  maxSize : number = 1048576 ;
  outSizeArray : any[] = [];
  valideSize : boolean = false;

  need_type !: string | null;
  titre !: string | null;
  description !: string | null;
  
  error ! :string | null;

  constructor( private router: Router , private imageService : ImageService) {}

  ngOnInit(): void {
  }

  changeType(event : Event){
    this.need_type = (event.target as HTMLSelectElement).value;
  }

  styleMaxSizePreview(size : number){
    if (size >= this.maxSize) {
      return { color: 'red', fontWeight: 'bold' };
    }
    else{ return null }
  }

  deletePreview(index : number , name : string){
    this.imagePreviews.splice(index, 1);
    this.localPictures.splice(this.localPictures.findIndex(image => image.fileName === name), 1);
    this.verifyLocalPictureSize();
    // console.log("LocalPicture : " ,this.localPictures);
  }

  verifyLocalPictureSize(){
    this.outSizeArray = this.imagePreviews.filter(image => image.size > this.maxSize);
    this.outSizeArray.length != 0 ? this.valideSize = false : this.valideSize = true ;
    // console.log("ImagePreview : " , this.imagePreviews);
    // console.log(this.valideSize);
    if(!this.valideSize) {
      let pluriel = ""; if(this.outSizeArray.length > 1) pluriel = "s" ;
      this.error = "" + this.outSizeArray.length + " image" + pluriel +  " superieur à 1 Mo detecter "
    }
    else{
      this.error = null ;
    }
  }

  async onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    // console.log(files);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push({
            src: e.target.result,
            name: files[i].name,
            size: files[i].size
          });
          this.verifyLocalPictureSize();

          //**Compress if jpg et png**
          if(files[i].type === 'image/jpg' || files[i].type === 'image/jpeg' || files[i].type === 'image/png'){
             this.CompressAndParsePng(files[i])
          }
          else {
            this.localPictures.push({
              value : e.target.result,
              type : "image/"+ files[i].name.split(".").pop(),
              categorie : "LOCAL_PICTURE",
              fileName : files[i].name,
            });
            // console.log('**Normal**');
          }
        // console.log(this.imagePreviews);
        // console.log("LocalPicture : " , this.localPictures);
        };
        reader.readAsDataURL(files[i]);
      };
      
    }
  }

  async CompressAndParsePng(file : File){
    this.imageService.compressListeImages([file]).subscribe({
      next : (compressed:any[]) => {
        compressed.forEach(async (file) => {
         this.localPictures.push({
            value : await this.imageService.convertToBase64(file).then(data => {return data}).catch(error => {return null}),
            type : file.type,
            categorie : "LOCAL_PICTURE",
            fileName : file.name,
          })
          // console.log('**Compress** ');
        });
        
        // console.log('Compressed Images: ', compressed);
    },
    error : error => {
       console.error('Error compressing the images: ', error);
    }
    });
  }

  addNeed() {
    let need = {
      type : this.need_type,
      titre : this.titre,
      description : this.description,
      image : this.imagePreviews
    }
    console.log(need);

    this.error = null ;

    if(need.type == undefined || need.type == null || need.type == ""){
      this.error = "Selectionner un type de besoin"
    }
    else if(need.titre == undefined || need.titre == null || need.titre == ""){
      this.error = "Le champ 'Titre' est obligatoire"
    }
    else if(need.description == undefined || need.description == null || need.description == ""){
      this.error = "Le champ 'Description' est obligatoire"
    }
    else if(this.imagePreviews.length != 0 && !this.valideSize){
      let pluriel = ""; if(this.outSizeArray.length > 1) pluriel = "s" ;
      this.error = "" + this.outSizeArray.length + " image" + pluriel +  " superieur à 1 Mo detecter "
      return
    }
    else{
      console.log("Ajouter");
      console.log(need);
      
    }

  }


}

