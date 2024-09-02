import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { data } from './data';
import { secteurs } from './secteur'
import { searchReceiverMixteComponent } from 'src/app/services/searchReceverMixte.component';
import { province } from '../search-receiver/province';
import { LocalisationService } from 'src/app/services/localisation.component';
import { environment } from 'src/environments/environment';
import { NearReceiverModel } from 'src/app/models/ReceiverMixte.model';
import { DetailsService } from 'src/app/services/details.service';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'app-search-receiver',
  templateUrl: './search-receiver.component.html',
  styleUrls: ['./search-receiver.component.scss'],
})
export class SearchReiceiverComponent implements OnInit {

  isHomeSearch : boolean = false ;
  user !: any;
  user_detail !: any;
  url: string = environment.URI + "/api/File/readImage?";
  data: any[] = data;
  secteurs: any[] = secteurs;
  total!: number;
  filtre: boolean = true;
  filtre_outside: boolean = false;
  filtre_activity: boolean = false;

  loading: boolean = true;
  load_receiver: boolean = true;
  load_region: boolean = true;
  load_district: boolean = true;
  loading_detail: boolean = false;
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

  search_text !: string;
  map !: string;

  // ** Pagination **

  nb_pagination!: number;
  paginationTab!: number[];
  pointerPage = 1;
  laste_pointerPage = 1;
  size: number = 2;

  preview_giver : boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private RCService: searchReceiverMixteComponent,
    private localisation: LocalisationService,
    private detailsService: DetailsService,
    private Pservice: PaginationService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    let p_user_detail = JSON.parse(localStorage.getItem('p_user_detail')!);
    window.innerWidth <= 700 ? this.filtre = false : this.filtre = true;
    this.verifySearchHome();
    this.getRegion();
    
    this.isHome();
    if(!this.isHomeSearch){
      !p_user_detail ? this.getDetails() : this.user_detail = p_user_detail ;
    }

    if (this.router.url.startsWith("/user/home/association")) {
      this.preview_giver = true;      
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('search');
  }

  isHome() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.url == "/recherche" ? this.isHomeSearch = true : this.isHomeSearch = false;
      }
      
  });
  this.location.path() == "/recherche" ? this.isHomeSearch = true : this.isHomeSearch = false ;
  }

  getDetails() {
    this.loading_detail = true ;
    if (this.user.type == 1) {
      this.detailsService.getGiverDetailById(this.user.id, this.user.isProfessional).subscribe((response) => {
        this.user_detail = response;
        this.loading_detail = false ;
        localStorage.setItem('p_user_detail', JSON.stringify(response));
        this.loadingInit();
      });
    }
    else {
      this.detailsService.getUserDetailById(this.user.id).subscribe((response) => {
        this.user_detail = response;
        this.loading_detail = false ;
        localStorage.setItem('p_user_detail', JSON.stringify(response));
        this.loadingInit();
      });
    }

  }

  imageUrl(name: string, type: string) {
    return this.url + "fileName=" + name + "&type=" + type;
  }

  verifySearchHome() {
    let listeReceiver = JSON.parse(localStorage.getItem('listeReceiver')!);
    let pg = JSON.parse(localStorage.getItem('pagination')!);

    if (listeReceiver && pg.page == "search_receiver") {
      this.data = listeReceiver;
      this.total = pg.total;
      // this.laste_pointerPage = pg.laste_pointerPage;
      // this.pointerPage = pg.pointerPage;
      // this.nb_pagination = pg.nb_pagination;
      // this.paginationTab = pg.paginationTab;
      this.loading = false;
      console.log(listeReceiver);
      this.getReceiverMixte(true);
    }
    else {
      this.getReceiverMixte();
    }
  }

  getReceiverMixte(no_loading: boolean = false, page: number = 1,) {
    if (page !== this.laste_pointerPage) this.loading_filtre = true;
    this.laste_pointerPage = page;
    no_loading ? this.load_receiver = true : this.load_receiver = false;

    if (this.search_text) {
      let params: any = {
        "key": this.search_text,
        "value": [
          "fullname", "province", "region", "district", "commune", "fokotany", "addresse"
        ]
      }
      this.RCService.searchReceiverMixte(params).subscribe((response) => {
        this.data = response.data;
        this.total = response.total;
        this.load_receiver = false;
        this.loadingInit();
        this.loading_filtre = false;
        this.paginationParams(response.data, response.total);
        console.log(response.data);
      });
    }
    else {
      this.RCService.getReceiverMixte(page).subscribe((response) => {
        this.data = response.data;
        this.total = response.total;
        this.load_receiver = false;
        this.loadingInit();
        this.loading_filtre = false;
        this.paginationParams(response.data, response.total);
        console.log(response.data);
        console.log(response.total);
      });
    }

  }

  loadingInit() {
    if (!this.load_region && !this.load_district && !this.load_commune && !this.load_receiver && !this.loading_detail) {
      this.loading = false;
    }
  }

  viewProfil(id: string) {
    //Si user n'est pas authentifier redirection logon/email
    let token = localStorage.getItem('token')!;
    let user = localStorage.getItem('user')!;
    let login = localStorage.getItem('login')!;

    localStorage.setItem('view_profil_id', id);

    if (token && user && login == 'true') {
      
      this.router.navigate(['/user/profil-view']);
    }
    else {

      this.router.navigate(['/auth/login/email']);
    }
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
      this.getReceiverMixte();
    }
  }

  getSearch(params: any) {
    this.RCService.searchReceiverMixte(params).subscribe((response) => {
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

    this.RCService.searchReceiverMixte(params).subscribe((response) => {
      this.data = response.data;
      this.total = response.total;
      this.paginationLocalParams(response.data)
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

  changeSecteur(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    if(value === 'tous') {
      this.search_text = "";
      this.pointerPage = 1 ;
      this.getReceiverMixte()
    }
    else {
      this.filtreRegion(value, "sectorActivity")
    }
  }

  proximite() {
    console.log("Proximité");
    let near: NearReceiverModel = {
      province: this.user_detail.province,
      region: this.user_detail.region,
      district: this.user_detail.district,
      commune: this.user_detail.commune,
      fokotany: this.user_detail.fokotany,
    };
    // console.log(data);
    this.loading_filtre = true;
    this.RCService.getNearReceiver(near).subscribe((response) => {
      this.data = response.data;
      this.total = response.total;
      this.loading_filtre = false;
      this.paginationLocalParams(response.data)
      console.log("Near :" , response);
    });
  }

  // ** Pagination **

  paginationParams(data: any, total: number) {
    this.local_pagination = false ;
    this.nb_pagination = Math.ceil(total / this.size);
    this.paginationTab = new Array(this.nb_pagination);
    this.total = total;

    localStorage.setItem('listeReceiver', JSON.stringify(data));
    localStorage.setItem('pagination', JSON.stringify(
      {
        'page': "search_receiver",
        'pointerPage': this.pointerPage,
        'laste_pointerPage': this.laste_pointerPage,
        'nb_pagination': this.nb_pagination,
        'paginationTab': this.paginationTab,
        'total': this.total
      }
    ));
  }

  changePagePagination(value: number) {
    this.pointerPage = value;
    !this.local_pagination  ? this.getReceiverMixte(false, value) : this.data = this.pages[value - 1];
  }

  nextPagination() {
    this.pointerPage = this.pointerPage + 1;
    !this.local_pagination  ? this.getReceiverMixte(false, this.pointerPage) : this.data = this.pages[this.pointerPage - 1];
  }

  previousPagination() {
    this.pointerPage = this.pointerPage - 1;
    !this.local_pagination  ? this.getReceiverMixte(false, this.pointerPage) : this.data = this.pages[this.pointerPage - 1];
  }

  // *** Front pagination pour Near , search region *** 

  local_pagination : boolean = false ;
  pages !: any [];
  page_size !: number ;

  paginationLocalParams(dataBase: any[], size = this.size) {
    this.local_pagination = true ;
    this.pointerPage = 1 ;
    this.laste_pointerPage = 1 ;
    this.page_size = size;
    this.pages = this.Pservice.paginate(dataBase, this.page_size);
    this.nb_pagination = this.pages.length;
    this.paginationTab = new Array(this.nb_pagination)
      .fill(null)
      .map((_, i) => i + 1);
    this.data = this.pages[0];
  }

}