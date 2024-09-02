import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from './data';
import { secteurs } from './secteur'
import { province } from './province';
import { LocalisationService } from 'src/app/services/localisation.component';
import { environment } from 'src/environments/environment';
import { searchReceiverMixteComponent } from 'src/app/services/searchReceverMixte.component';

@Component({
  selector: 'app-admin-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class AdminSearchComponent implements OnInit {
  menu_active : number = 1;
  url : string = environment.URI + "/api/File/readImage?";
  data: any[] = data;
  secteurs: any[] = secteurs;
  total!: number;
  global_filtre : any = [{"key": "isValid","value": "true"}];
  filtre: boolean = true;
  filtre_outside: boolean = false;
  filtre_activity: boolean = false;

  loading: boolean = true;
  load_receiver: boolean = true;
  load_region: boolean = true;
  load_district: boolean = true;
  load_commune: boolean = true;
  loading_filtre: boolean = false;

  province: any[] = province;
  region !: any[];
  district !: any[];
  commune !: any[];
  fokontany: any[] = [];
  regionR !: any[];
  districtR !: any[];
  communeR !: any[];

  nb: any = {
    all: 0,
    giver: 0,
    receiver: 0,
  }

  search_text !: string;
  map !: string;
  // ** Pagination **
  nb_pagination!: number;
  paginationTab!: number[];
  pointerPage = 1;
  laste_pointerPage = 1;
  size : number = 1000;

  constructor(
    private router: Router, 
    private RCService: searchReceiverMixteComponent, 
    private localisation: LocalisationService
    ) { }

  ngOnInit(): void {
    window.innerWidth <= 700 ? this.filtre = false : this.filtre = true;
    this.getUtilisateur();
    this.getRegion();
  }

  menu(target : number){
    this.menu_active = target ;
    // target == 1 ? this.global_filtre = "" 
    // : target == 2 ? this.global_filtre = "GIVER"  : this.global_filtre = "RECIVER" ;

    console.log(target);
    
    let filtre !: any[] ;
    if (target == 1 ) filtre =  [{"key": "isValid","value": "true"}]
    if (target == 2 ) filtre =  [{"key": "isValid","value": "true"} , {"key": "type","value": "GIVER"}]
    if (target == 3 ) filtre =  [{"key": "isValid","value": "true"} , {"key": "type","value": "RECEIVER"}]
    this.getAllUser( filtre , 1 , false)
  }

  ngOnDestroy(): void {
    localStorage.removeItem('search');
  }

  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name + "&type=" + type ;
  }

  getUtilisateur(page: number = 1) {
    if (page !== this.laste_pointerPage) this.loading_filtre = true;
    this.laste_pointerPage = page;
    this.load_receiver = true;
    if(this.search_text){ 
      let params: any = {
        "key": this.search_text,
        "value": [
          "fullname", "province", "region", "district", "commune", "fokotany", "addresse"
        ]
      }
      this.RCService.searchAdmin(this.global_filtre , params).subscribe((response:any) => {
        this.data = response.data ;
        this.load_receiver = false ;
        this.dashbordAffichage();
        this.loadingInit();
        this.loading_filtre = false ;
        this.paginationParams(response.data, response.total) ;
        console.log(response.data) ;
      });
    }
    else{
       this.getAllUser(this.global_filtre , page)
    }
    
  }

  getAllUser( filtre : any , page: number , update_affichage : boolean = true){
    console.log("data3");
    this.load_receiver = true;
    this.loading_filtre = true;
      this.RCService.getAllUser(filtre,page).subscribe((response:any) => {
        this.data = response.data;
        this.total = response.total;
        if(update_affichage) this.dashbordAffichage()
        this.load_receiver = false;
        this.loadingInit();
        this.loading_filtre = false;
        this.paginationParams(response.data, response.total);
        console.log(response.data);
        console.log(response.total);
      });
  }

  dashbordAffichage() {
    this.nb.giver = this.data.filter(user => user.type === 1).length;
    this.nb.receiver = this.data.filter(user => user.type == 0).length;
  }

  loadingInit() {
    if (!this.load_region && !this.load_district && !this.load_commune && !this.load_receiver) {
      this.loading = false;
    }
  }

  viewProfil(id: string) {
    localStorage.setItem('view_profil_id', id);
    this.router.navigate(['/niveau/admin/utilisateur/profil-view']);
  }

  affFiltre() {
    if (this.filtre == false) {
      this.filtre = true;
      setTimeout(() => {
        this.filtre_outside = true;
      }, 50);
    }
    else {
      this.filtre = false;
      this.filtre_outside = false;
    }
  }

  handleClickOutsideFiltre() {
    if (this.filtre_outside == true) {
      this.filtre = false;
      this.filtre_outside = false;
    }
  }

  search() {
    if (this.search_text) {
      console.log(this.search_text);
      this.load_receiver = true;
      this.loading = true;

      let params: any = {
        "key": this.search_text,
        "value": [
          "fullname", "province", "region", "district", "commune", "fokotany", "addresse"
        ]
      }
      this.getSearch(params);
    }
    else {
      this.getUtilisateur();
    }
  }

  getSearch(params: any) {
    this.RCService.searchAdmin(this.global_filtre , params).subscribe((response:any) => {
      this.data = response.data;
      this.load_receiver = false;
      this.loadingInit();
      this.paginationParams(response.data, response.total);
      console.log(response.data);
    });
  }

  filtreRegion(value: string, target: string) {
    this.loading_filtre = true;

    let params = {
      "key": value,
      "value": [
        target
      ]
    }

    console.log(params);

    this.RCService.searchAdmin(this.global_filtre , params).subscribe((response:any) => {
      this.data = response.data;
      this.loading_filtre = false;
      console.log(response.data);
    });
  }

  showFilterActivity() {
    this.filtre_activity = !this.filtre_activity;
  }

  // ** Region ***

  getRegion() {
    this.localisation.getRegion().subscribe(data => {
      console.log(data);
      this.region = data;
      this.regionR = data;
      this.load_region = false;
      this.loadingInit();
    });
    this.localisation.getDistrict().subscribe(data => {
      console.log(data);
      this.district = data;
      this.districtR = data;
      this.load_district = false;
      this.loadingInit();
    });
    this.localisation.getCommune().subscribe(data => {
      console.log(data);
      this.commune = data;
      this.communeR = data;
      this.load_commune = false;
      this.loadingInit();
    });
  }

  changeProvince(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.region = this.regionR;
    this.region = this.region.filter((element) => element.province == value);
    this.filtreRegion(value, "province");
  }

  changeRegion(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.district = this.districtR;
    this.district = this.district.filter((element) => element.region == value);
    this.filtreRegion(value, "region");
  }

  changeDistrict(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.commune = this.communeR;
    this.commune = this.commune.filter((element) => element.district == value);
    this.filtreRegion(value, "district");
  }

  changeCommune(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    this.filtreRegion(value, "commune");
    value = value.replace(/-/g, ' ');
    this.localisation.getFonkotany(value).subscribe(data => {
      console.log('Fonkontany :', data);
      this.fokontany = data;
    });

  }

  // ** Pagination **

  paginationParams(data: any, total: number) {
    this.nb_pagination = Math.ceil(total / this.size);
    this.paginationTab = new Array(this.nb_pagination);
    this.total = total;

    // localStorage.setItem('liste_utilisateur', JSON.stringify(data));
    // localStorage.setItem('pagination_adm', JSON.stringify(
    //   {
    //     'page': "search_adm",
    //     'pointerPage': this.pointerPage,
    //     'laste_pointerPage': this.laste_pointerPage,
    //     'nb_pagination': this.nb_pagination,
    //     'paginationTab': this.paginationTab
    //   }
    // ));
  }

  changePagePagination(value: number) {
    this.pointerPage = value;
    this.getUtilisateur(value);
  }

  nextPagination() {
    this.pointerPage = this.pointerPage + 1;
    this.getUtilisateur(this.pointerPage);
  }

  previousPagination() {
    this.pointerPage = this.pointerPage - 1;
    this.getUtilisateur(this.pointerPage);
  }


}