import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { environment } from 'src/environments/environment';

Chart.register(...registerables);
// import { parainage } from '../data';
import { DonateService } from 'src/app/services/donate.service';
import { PaginationService } from 'src/app/services/pagination.service';

@Component({
  selector: 'donate-activite',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class ActiviteDonateComponent implements OnInit {

  url : string = environment.URI + "/api/File/readImage?";
  user: any;
  chart: any = [];
  data!: any[];
  dataR!: any[];
  blocChart: boolean = false;
  loading: boolean = true;

  nb: any = {
    monetaires: 0,
    materiels: 0,
    alimentaires: 0,
    benevolat: 0
  }
  filter : boolean = false ;
  fitreOutside : boolean = false ;
  filtre_active !: number;
  filtre_active_liste !: number;
  filtre_liste = [
    {name : "Tous" , target : 0},
    {name :"Biens matériels", target : 2},
    {name :"Dons alimentaires", target : 3},
    {name :"En cours" , target : 8},
    {name :"Annulés", target : 9},
]

  constructor(
    private router: Router, 
    private donateService: DonateService , 
    private pgService : PaginationService
    ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!)
    console.log(this.user);
    this.user.type == 1 ? this.getGiverDonate() : this.getReceiverDonate();
    // this.chartConfig() ;
  }

  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name +"&type=" + type ;
  }

  getGiverDonate() {
    this.donateService.getByGiverId(this.user.id).subscribe((data: any) => {
      this.data = data;
      this.dataR = data;
      this.loading = false;
      this.dashbordAffichage();
      this.paginationParams(data, data.length);
      console.log(data);
    });
  }

  getReceiverDonate() {
    this.donateService.getByReceiverId(this.user.id).subscribe((data: any) => {
      this.data = data;
      this.dataR = data;
      this.loading = false;
      this.dashbordAffichage();
      this.paginationParams(data, data.length);
      console.log(data);
    });
  }

  // verifComfirmDeliveryAndFormat(){
  //   if(this.data.donateTracking!.isDeliveryConfirmGiver && this.data.donateTracking!.isDeliveryConfirmReceiver){
  //     this.data.state = "livré"
  //   }
  // }

  view(index: number) {
    localStorage.setItem('donate_detail', JSON.stringify(this.data[index]));
    this.router.navigate(['/user/donate/view']);
  }

  dashbordAffichage() {
    // this.nb.monetaires = this.data.filter(gift => gift.type === 1).length;
    this.nb.materiels = this.data.filter(gift => gift.type === 2).length;
    this.nb.alimentaires = this.data.filter(gift => gift.type === 3).length;
    // this.nb.benevolat = this.data.filter(gift => gift.type === 4).length;
    console.log(this.nb);
  }
  
  filtre(target : number , index : number = 0) {
    this.filtre_active = target ;
    this.filtre_active_liste = index ;
    console.log(target);
    
    this.data = this.dataR ;
    [2,3].includes(target) ? (target == 2 ? this.filtre_active = 1 : this.filtre_active = 2) : null ;
    [2,3].includes(target) ? this.data = this.data.filter(gift => gift.type === target) : null ;
      
    target == 0 ? this.data = this.dataR : null ;
    target == 0 ? this.filtre_active = 0 : null ;
    target == 8 ? this.data = this.data.filter(gift => gift.state === "NEW") : null ;
    target == 9 ? this.data = this.data.filter(gift => gift.state === "annulé") : null ;
  }

  showFiltre() {
    if(this.filter == false){
      this.filter = true;
      setTimeout(() => {
        this.fitreOutside = true;
      }, 50);
    }
    else{
      this.filter = false;
      this.fitreOutside = false;
    }
  }

  handleClickOutsideFiltre(){
    if(this.fitreOutside == true){
      this.filter = false;
      this.fitreOutside = false;
    }
  }

   // ** Pagination **

   page !: any[];
   page_size : number = 10;
   nb_pagination!: number;
   paginationTab!: number[];
   pointerPage = 1;
   laste_pointerPage = 1;
   total!: number;
   
   paginationParams(data: any, total: number) {
    this.nb_pagination = Math.ceil(total / this.page_size);
    this.paginationTab = new Array(this.nb_pagination);
    this.total = total;
    this.page = this.pgService.paginate(data, this.page_size);
    console.log(this.page);
    

    localStorage.setItem('listeReceiver', JSON.stringify(data));
    localStorage.setItem('pagination', JSON.stringify(
      {
        'page': "donate",
        'pointerPage': this.pointerPage,
        'laste_pointerPage': this.laste_pointerPage,
        'nb_pagination': this.nb_pagination,
        'paginationTab': this.paginationTab
      }
    ));
  }

  changePagePagination(value: number) {
    this.pointerPage = value;
    this.data = this.page[value - 1];
  }

  nextPagination() {
    this.pointerPage = this.pointerPage + 1;
    this.data = this.page[this.pointerPage - 1];
  }

  previousPagination() {
    this.pointerPage = this.pointerPage  - 1;
    this.data = this.page[this.pointerPage - 1];
  }


  //  ** ** ** ** ** ** ** 

  chartConfig() {
    var myChart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Ju', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Activité par Mois',
          data: [0, 2, 3, 3, 5, 4, 2, 2, 4, 3, 2, 3],
          borderColor: '#6a00f4',
          backgroundColor: '#6a00f4',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,

        }]
      },
      options: {
        aspectRatio: 3.6,
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          x: {
            grid: {
              tickLength: 20,
              color: 'transparent',
              drawOnChartArea: false,
            },
            border: {
              color: 'transparent',
            },
            beginAtZero: true,
          }
        }
      }
    });
  }
  // aspectRatio : espacement


}