import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from './data';
import { secteurs } from './secteur'
import { searchReceiverMixteComponent } from 'src/app/services/searchReceverMixte.component';
import { province } from '../search-need/province';
import { LocalisationService } from 'src/app/services/localisation.component';

@Component({
  selector: 'app-search-need',
  templateUrl: './search-need.component.html',
  styleUrls: ['./search-need.component.scss'],
})
export class SearchNeedComponent implements OnInit {

  data : any[] = data ;
  secteurs : any[] = secteurs;
  total! : number ;
  filtre : boolean = true ;
  filtre_outside:boolean = false ;
  filtre_activity : boolean = false ;

  loading : boolean = true;
  load_receiver : boolean = true ;
  load_region : boolean = true ;
  load_district : boolean = true ;
  load_commune : boolean = true ;
  loading_filtre : boolean = false;

  province : any[] = province ;
  region !: any[] ;
  district ! : any[] ;
  commune ! : any[] ;
  fokontany  : any[] = [];

  regionR !: any[] ;
  districtR ! : any[] ;
  communeR ! : any[] ;

  search_text !: string ;
  map !: string ;
  

  // ** Pagination **

  nb_pagination!: number;
  paginationTab!: number[];
  pointerPage = 1;

  constructor( private router: Router , private RCService : searchReceiverMixteComponent , private localisation : LocalisationService ) {}

  ngOnInit(): void {
    window.innerWidth <= 700 ? this.filtre = false :  this.filtre = true;
    this.verifySearchHome();
    this.getRegion();
  }
   
  ngOnDestroy(): void{
    localStorage.removeItem('search');
  }
  
  verifySearchHome(){
    let search = JSON.parse(localStorage.getItem('search')!)
    
    if(search){
      console.log(search);
      let params : any = {
        "key": search.text ,
        "value": [
          "fullname","province","region","district", "commune","fokotany","addresse"
        ]
      }
      this.getSearch(params);
    }
    else {
      this.getReceiverMixte()
    }
  }
  
  getReceiverMixte(page : number = 1){
    this.load_receiver = true ;
    this.RCService.getReceiverMixte(page).subscribe((response) => {
      this.data = response.data ;
      this.total = response.total ;
      this.load_receiver = false ;
      this.loadingInit();
      console.log(response.data);
      console.log(response.total);

      this.nb_pagination = Math.ceil(response.total/10);
      this.paginationTab = new Array(this.nb_pagination);
    });
  }

  loadingInit(){
    if(!this.load_region && !this.load_district && !this.load_commune && !this.load_receiver ){
      this.loading = false ;
    }
  }

  viewProfil(id:string) {
    //Si user n'est pas authentifier redirection logon/email
    let token  = localStorage.getItem('token')!;
    let user = localStorage.getItem('user')!;
    let login = localStorage.getItem('login')!;

    localStorage.setItem('view_profil_id', id);
    
    if(token && user && login == 'true'){;
      this.router.navigate(['/user/profil-view']);
    }
    else {
      
      this.router.navigate(['/auth/login/email']);
    }
   
  }

  affFiltre(){
    if(this.filtre == false){
      this.filtre = true;
      setTimeout(() => {
        this.filtre_outside = true;
      }, 50);
    }
    else{
      this.filtre = false;
      this.filtre_outside = false;
    }
  }

  handleClickOutsideFiltre(){
    if(this.filtre_outside == true){
      this.filtre = false;
      this.filtre_outside = false;
    }
  }

  search(){
    console.log(this.search_text );
    this.load_receiver = true ;
    this.loading = true;

    let params : any = {
      "key": this.search_text ,
      "value": [
        "fullname","province","region","district", "commune","fokotany","addresse"
      ]
    }
    this.getSearch(params);
  }

  getSearch(params :  any){
    this.RCService.searchReceiverMixte(params).subscribe((response) => {
      this.data = response.data ;
      this.load_receiver = false ;
      this.loadingInit();
      console.log(response.data);
    });
  }

  filtreRegion(value : string , target : string){
    this.loading_filtre = true ;

    let params = {
      "key": value,
      "value": [
        target
      ]
    }
    
    console.log(params);
    
    this.RCService.searchReceiverMixte(params).subscribe((response) => {
      this.data = response.data ;
      this.loading_filtre = false ;
      console.log(response.data);
    });
  }

  showFilterActivity(){
    this.filtre_activity = !this.filtre_activity ;
  }

  // ** Region ***

  getRegion(){
    this.localisation.getRegion().subscribe(data => {
      console.log(data);
      this.region = data ;
      this.regionR = data ;
      this.load_region = false ;
      this.loadingInit();
    });
    this.localisation.getDistrict().subscribe(data => {
      console.log(data);
      this.district = data ;
      this.districtR = data ;
      this.load_district = false ;
      this.loadingInit();
    });
    this.localisation.getCommune().subscribe(data => {
      console.log(data);
      this.commune = data ;
      this.communeR = data ;
      this.load_commune = false ;
      this.loadingInit();
    });
  }

  changeProvince(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.region = this.regionR;
    this.region = this.region.filter((element) => element.province == value);
    this.filtreRegion(value , "province");
  }

  changeRegion(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.district = this.districtR;
    this.district = this.district.filter((element) => element.region == value);
    this.filtreRegion(value , "region");
  }

  changeDistrict(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.commune = this.communeR;
    this.commune = this.commune.filter((element) => element.district == value);
    this.filtreRegion(value , "district");
  }

  changeCommune(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.filtreRegion(value , "commune");
    value = value.replace(/-/g, ' ');
    this.localisation.getFonkotany(value).subscribe(data => {
      console.log('Fonkontany :', data);
      this.fokontany = data ;
    });
    
  }

  // ** Pagination **

  
  changePagePagination(value: number){
      this.pointerPage = value;
      this.getReceiverMixte(value);
  }

  nextPagination(){
    this.pointerPage = this.pointerPage + 1 ;
    this.getReceiverMixte(this.pointerPage);
  }

  previousPagination(){
    this.pointerPage = this.pointerPage - 1 ;
    this.getReceiverMixte(this.pointerPage);
  }


}