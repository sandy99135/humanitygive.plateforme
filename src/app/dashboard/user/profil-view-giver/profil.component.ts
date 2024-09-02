import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { images } from '../profil3/data';
import { DetailsService } from 'src/app/services/details.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'profil-view-giver',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilViewGiverComponent implements OnInit {
  url : string = environment.URI + "/api/File/readImage?";
  user : any ;
  profil_image ! :any ;
  couverture_url ! : any ;
  image_home : any[] = [];

  images :any[] = images;
  image_profil_home : any[] = images.slice(0, 3);
  detail : number = 1 ;
  view_profil_id! : string ;
  data!:any;
  loading : boolean = true ;

  // data : any = {
  //   fullName:"",
  //   realisations : []
  // }

  affListImage: boolean = false;
  viewImage: String = '';
  indexViewImage : number = 0;

  @ViewChild('scrollableDiv') scrollableDiv!: ElementRef;

  constructor( private router: Router , private details : DetailsService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!)
    let view_profil =  JSON.parse(localStorage.getItem('view_giver_profil')!);
    // this.view_profil_id =  localStorage.getItem('view_giver_profil')!;
    this.setProfile(view_profil);
  }

  setProfile(data : any){
      this.data = data ;
      localStorage.setItem('profil_view',JSON.stringify(data)) ;
      this.loading = false ;
      console.log(data) ;
      this.profil_image = this.data.profilPicture ? this.imageUrl(this.data.profilPicture.name , this.data.profilPicture.type): "" ;
      this.couverture_url = this.data.couvertPicture ? this.imageUrl(this.data.couvertPicture.name , this.data.couvertPicture.type) : "" ;
      this.image_home = data.localPictures!.length >= 3 ? data.localPictures!.slice(0, 3) : data; 
  }

  getProfile(id:string){
    this.details.getUserDetailById(id).subscribe((data:any) => {
      this.data = data ;
      localStorage.setItem('profil_view',JSON.stringify(data));
      this.loading = false;
      console.log(data);
      this.profil_image = this.data.profilPicture ? this.imageUrl(this.data.profilPicture.name , this.data.profilPicture.type): "" ;
      this.couverture_url = this.data.couvertPicture ? this.imageUrl(this.data.couvertPicture.name , this.data.couvertPicture.type) : "" ;
      this.image_home = data.localPictures.slice(0, 3);
    });
  }

  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name +"&type=" + type ;
  }

  changeDetail(value : number) {
    this.detail = value ;
  }


  ChangeViewImage(index: number , image : any){
    this.affListImage = true;
    this.indexViewImage = index ;
    this.viewImage = this.imageUrl(image.name , image.type);
  }

  ChangeHomeViewImage(index: number , image : any){
    this.detail = 3;
    this.affListImage = true;
    this.indexViewImage = index ;
    this.viewImage = this.imageUrl(image.name , image.type);
  }

  ChangeView(direction : string) {
    direction == 'next' ? this.indexViewImage ++ : this.indexViewImage --
    direction == 'next' ? this.moveScrollRight()  : this.moveScrollLeft()
    let image = this.data.localPictures[this.indexViewImage];
    this.viewImage = this.imageUrl(image.name , image.type);
  }

  moveScrollRight() {
    const scrollableDiv = this.scrollableDiv.nativeElement;
    scrollableDiv.scrollLeft += 110;
  }

  moveScrollLeft() {
    const scrollableDiv = this.scrollableDiv.nativeElement;
    scrollableDiv.scrollLeft -= 110;
  }

  moveScroll(move : number , index : number):any{
    if(index >= 12) {
      const scrollableDiv = this.scrollableDiv.nativeElement;
      scrollableDiv.scrollLeft += move;
    }
  }

  closeViewImage() {
    this.affListImage = false;
  }

  soutenir() {
    localStorage.setItem('donate_receiver', this.data.id);
    this.router.navigate(['/user/donate']);
  }
  
}