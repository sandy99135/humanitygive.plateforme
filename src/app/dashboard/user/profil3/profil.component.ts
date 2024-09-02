import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { images } from './data';
import { DetailsService } from 'src/app/services/details.service';
import { DeleteImageModel, FileImage, PreviewImage, UserKeyPhotoEnum } from 'src/app/models/image';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ImageService } from 'src/app/services/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profil3',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class Profil3Component implements OnInit {

  url: string = environment.URI + "/api/File/readImage?";
  user: any;
  images: PreviewImage[] = [];
  image_home: any[] = [];
  detail: number = 1;

  id !: string;
  data: any = {
    fullName: "",
    realisations: [],
    profilPicture: []
  }

  affListImage: boolean = false;
  viewImage: String = '';
  indexViewImage: number = 0;
  loading : boolean = true ;

  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  constructor(
    private router: Router,
    private detailsService: DetailsService,
    private imageService: ImageService,
  ) {
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token')!;
    let user = JSON.parse(localStorage.getItem('user')!);
    this.user = user;
    this.id = user.id;
    this.getDetails(user.id);
  }

  getDetails(id: string) {

    if (this.user.type == 1) {
      this.detailsService.getGiverDetailById(id , this.user.isProfessional).subscribe((response) => {
        this.loading = false;
        this.data = response;
        console.log(this.data);
        this.profil_image = this.data.profilPicture ? this.imageUrl(this.data.profilPicture.name, this.data.profilPicture.type) : "";
        this.couverture_url = this.data.couvertPicture ? this.imageUrl(this.data.couvertPicture.name, this.data.couvertPicture.type) : "";
        this.image_home = response.localPictures ? response.localPictures.slice(0, 3) : [];
      });
    }
    else {
      this.detailsService.getUserDetailById(id).subscribe((response) => {
        this.loading = false;
        this.data = response;
        console.log(this.data);
        this.profil_image = this.data.profilPicture ? this.imageUrl(this.data.profilPicture.name, this.data.profilPicture.type) : "";
        this.couverture_url = this.data.couvertPicture ? this.imageUrl(this.data.couvertPicture.name, this.data.couvertPicture.type) : "";
        this.image_home = response.localPictures ? response.localPictures.slice(0, 3) : [];
      });
    }

  }

  imageUrl(name: string, type: string) {
    return this.url + "fileName=" + name + "&type=" + type;
  }

  changeDetail(value: number) {
    this.detail = value;
  }

  // ** Photo profil ***

  profil_image !: any;
  profil_taille_max: string = "1024 x 1024";
  cropperEvent!: any;
  cropper_width !: any;
  cropper: boolean = false;
  imageChangedEvent: any = '';
  // croppedImage!: any ;

  preview_couvert: boolean = false;
  couverture_url: string | ArrayBuffer | null | undefined = null;
  pre_couverture_url: string | ArrayBuffer | null = null;
  couvert64?: string | ArrayBuffer | null;
  couvert_taille !: any;
  couvert_taille_max: string = "2000 x 1400";
  couvert_valide: boolean = false;

  profil_type!: string | undefined;
  couverture_type!: string;

  loading_save_profil: boolean = false;
  loading_save_couvert: boolean = false;

  maxSizeInBytes: any = 1024 * 1024;

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.cropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.cropperEvent = event;
    this.cropper_width = event.width;
    console.log(event)
  }

  async saveProfil() {
    this.loading_save_profil = true;
    const profil_base64 = await this.imageService.convertImageUrlToBase64(this.cropperEvent.objectUrl);
    // console.log(profil_base64);

    let image: FileImage = {
      id: this.id,
      type: UserKeyPhotoEnum.PROFIL,
      singleFile: {
        value: profil_base64,
        type: this.cropperEvent.blob?.type,
        categorie: "PROFIL_PICTURE"
      },
      listFile: [
        {
          value: null,
          type: null,
          categorie: null
        }
      ]
    }
    console.log(image);

    this.imageService.addImage(image).subscribe({
      next:(data) => {
        console.log(data);
        this.loading_save_profil = false;
      },
      error : (error) => {
        console.log(error)
        if (error.status == 200) {
          this.profil_image = this.cropperEvent.objectUrl;
          this.cropper = false;
        }
        this.loading_save_profil = false;
      }
    });
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // ** Photo couverture ***

  couvertureSelected(event: any) {
    const file = event.target.files[0];
    this.couverture_type = file.type;
    if (file) {
      this.couvertureProfil(file);
      this.preview_couvert = true;
    }
  }

  couvertureProfil(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pre_couverture_url = e.target?.result;
      this.couvert64 = e.target?.result;
      this.tailleCouverture(e.target?.result);
    };
    reader.readAsDataURL(file);
  }

  tailleCouverture(result: any) {
    const image = new Image();
    image.src = result;
    image.onload = () => {
      this.couvert_taille = image.width + ' x ' + image.height;
      if (image.width <= 2000 || image.height <= 1400) {
        image.height <= (image.width * 7 / 10) ? this.couvert_valide = true : this.couvert_valide = false;
      }
      else {
        this.couvert_valide = false
      }
      console.log(this.couvert_valide);

    }
  }

  saveCouvert() {
    this.loading_save_couvert = true;

    let image: FileImage = {
      id: this.id,
      type: UserKeyPhotoEnum.COUVERTURE,
      singleFile: {
        value: this.couvert64,
        type: this.couverture_type,
        categorie: "COUVERT_PICTURE"
      },
      listFile: [
        {
          value: null,
          type: null,
          categorie: null
        }
      ]
    }
    console.log(image);

    this.imageService.addImage(image).subscribe({
      next : (data) => {
        console.log(data);
        this.loading_save_couvert = false;
        this.preview_couvert = false;
      },
      error : (error) => {
        console.log(error)
        this.loading_save_couvert = false;
        if (error.status == 200) {
          this.couverture_url = this.couvert64;
          this.preview_couvert = false;
        }
      }
    });
  }

  // *** LocalPicture ***

  imagePreviews: { src: string, name: string, size: number }[] = [];
  localPictures: { value: any, type: string, categorie: string, fileName?: string }[] = [];
  loading_local_pictures: boolean = false;
  error_localPictures: boolean = false;

  maxSize: number = 1048576;
  valideSize: boolean = false;
  outSizeArray: any[] = [];

  // onFileChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const files = inputElement.files;
  //   if (files) {
  //     for (let i = 0; i < files.length; i++) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.imagePreviews.push({
  //           src: e.target.result,
  //           name: files[i].name,
  //           size: files[i].size
  //         });
  //         this.localPictures.push({
  //           value : e.target.result,
  //           type : "image/"+ files[i].name.split(".").pop(),
  //           categorie : "LOCAL_PICTURE",
  //         });

  //       };
  //       reader.readAsDataURL(files[i]);
  //     }
  //     console.log(this.imagePreviews);
  //     console.log(this.localPictures);

  //   }
  // }

  async onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    console.log(files);
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
          if (files[i].type === 'image/jpg' || files[i].type === 'image/jpeg' || files[i].type === 'image/png') {
            this.CompressAndParsePng(files[i])
          }
          else {
            this.localPictures.push({
              value: e.target.result,
              type: "image/" + files[i].name.split(".").pop(),
              categorie: "LOCAL_PICTURE",
              fileName: files[i].name,
            });
            console.log('**Normal**');
          }
          console.log(this.imagePreviews);
          console.log("LocalPicture : ", this.localPictures);
        };
        reader.readAsDataURL(files[i]);
      };

      // Compress jpg et png
      // this.imageService.compressListeImages(Array.from(files)).subscribe(
      //   (compressed:any[]) => {
      //       compressed.forEach(async (file) => {
      //        this.localPictures.push({
      //           value : await this.imageService.convertToBase64(file).then(data => {return data}).catch(error => {return null}),
      //           type : file.type,
      //           categorie : "LOCAL_PICTURE",
      //         });
      //       });
      //       console.log('Compressed Images: ', compressed);
      //   },
      //   error => {
      //      console.error('Error compressing the images: ', error);
      //   }
      // );
      // console.log(this.imagePreviews);
      // console.log("LocalPicture : " , this.localPictures);
    }
  }

  async CompressAndParsePng(file: File) {
    this.imageService.compressListeImages([file]).subscribe({
     next :  (compressed: any[]) => {
        compressed.forEach(async (file) => {
          this.localPictures.push({
            value: await this.imageService.convertToBase64(file).then(data => { return data }).catch(error => { return null }),
            type: file.type,
            categorie: "LOCAL_PICTURE",
            fileName: file.name,
          })
          console.log('**Compress** ');
        });

        console.log('Compressed Images: ', compressed);
      },
      error : error => {
        console.error('Error compressing the images: ', error);
      }
    });
  }

  deletePreview(index: number, name: string) {
    this.imagePreviews.splice(index, 1);
    this.localPictures.splice(this.localPictures.findIndex(image => image.fileName === name), 1);
    this.verifyLocalPictureSize();
    console.log("LocalPicture : ", this.localPictures);
  }

  verifyLocalPictureSize() {
    // this.imagePreviews.forEach((image) => {
    //   if(image.size > this.maxSize) this.valideSize = false ;
    // })
    this.outSizeArray = this.imagePreviews.filter(image => image.size > this.maxSize);
    this.outSizeArray.length != 0 ? this.valideSize = false : this.valideSize = true;
    console.log("ImagePreview : ", this.imagePreviews);
    console.log(this.valideSize);

  }

  styleMaxSizePreview(size: number) {
    if (size >= this.maxSize) {
      return { color: 'red', fontWeight: 'bold' };
    }
    else { return null }
  }

  savePreview() {
    this.loading_local_pictures = true;
    this.error_localPictures = false;

    console.log(this.imagePreviews);
    console.log(this.images);

    let image: FileImage = {
      id: this.id,
      type: UserKeyPhotoEnum.PHOTOLOCAL,
      singleFile: {
        value: null,
        type: null,
        categorie: null
      },
      listFile: this.localPictures.map(img => ({ value: img.value, type: img.type, categorie: img.categorie }))
    }

    console.log("Save :", image);


    this.imageService.addImage(image).subscribe({
      next : (data) => {
        console.log(data);
        this.loading_local_pictures = false;
      },
      error : (error) => {
        console.log(error)
        if (error.status == 200) {
          this.getDetails(this.id);
          this.imagePreviews.forEach((img) => {
            this.images.unshift(img)
          })
          this.imagePreviews = [];
        }
        else {
          this.error_localPictures = true;
        }
        this.loading_local_pictures = false;
      }
    });

  }


  // *****

  ChangeViewImage(index: number, image: any) {
    this.affListImage = true;
    this.indexViewImage = index;
    this.viewImage = this.imageUrl(image.name, image.type);
  }

  ChangeHomeViewImage(index: number, image: any) {
    this.detail = 3;
    this.affListImage = true;
    this.indexViewImage = index;
    this.viewImage = this.imageUrl(image.name, image.type);
  }

  ChangeView(direction: string) {
    direction == 'next' ? this.indexViewImage++ : this.indexViewImage--
    direction == 'next' ? this.moveScrollRight() : this.moveScrollLeft()
    let image = this.data.localPictures[this.indexViewImage];
    this.viewImage = this.imageUrl(image.name, image.type);
  }

  moveScrollRight() {
    const scrollableDiv = this.scrollableDiv.nativeElement;
    scrollableDiv.scrollLeft += 110;
  }

  moveScrollLeft() {
    const scrollableDiv = this.scrollableDiv.nativeElement;
    scrollableDiv.scrollLeft -= 110;
  }

  moveScroll(move: number, index: number): any {
    if (index >= 12) {
      const scrollableDiv = this.scrollableDiv.nativeElement;
      scrollableDiv.scrollLeft += move;
    }
  }

  closeViewImage() {
    this.affListImage = false;
  }

  loading_delete: boolean = false;

  deleteImage() {
    this.loading_delete = true;
    let image: DeleteImageModel = {
      id: this.id,
      listFile: [this.data.localPictures[this.indexViewImage].id]
    }
    this.imageService.deleteImage(image).subscribe( {
      next : (data) => { this.loading_delete = false; },
      error :(error) => {
        console.log(error)
        if (error.status == 200) {
          this.deleteImageVisible()
        }
        this.loading_delete = false;
      }
    });
  }

  deleteImageVisible() {
    if (this.data.localPictures.length == 1) {
      this.data.localPictures.splice(0, 1);
      this.affListImage = false;
    }
    else {
      this.data.localPictures.splice(this.indexViewImage, 1);
      if (this.indexViewImage == this.data.localPictures.length) this.indexViewImage -= 1;
      let image = this.data.localPictures[this.indexViewImage];
      let image0 = this.data.localPictures[0];
      this.data.localPictures.length !== 1 ? this.viewImage = this.imageUrl(image.name, image.type) : this.viewImage = this.imageUrl(image0.name, image0.type);
      if (this.data.localPictures.length == 0) this.affListImage = false;
    }

    if (this.indexViewImage < 3) this.image_home.splice(this.indexViewImage, 1);
  }



}

