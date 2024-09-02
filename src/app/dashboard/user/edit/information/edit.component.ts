import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { DetailsService } from 'src/app/services/details.service';
import { province } from './province'
import { LocalisationService } from 'src/app/services/localisation.component';
import { PickListService } from 'src/app/services/PickList.service';

@Component({
  selector: 'app-edit-receiver-mixte',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditReceiverMixteComponent implements OnInit {

    myForm!: FormGroup;
    user !: any ;
    id !: string;
    details ! : any ;

    loading : boolean = true;
    load_region : boolean = false ;
    load_district : boolean = false ;
    load_commune : boolean = false ;
    load_sector_activity : boolean = false ;
    loading_update : boolean = false ;

    sector_activity_list !: any[] ;
    province : any[] = province ;
    region !: any[] ;
    district ! : any[] ;
    commune ! : any[] ;
    fokotany  : any[] = [];

    regionR !: any[] ;
    districtR ! : any[] ;
    communeR ! : any[] ;
    apparenceYear : string =''
    error : boolean = false ;

    constructor(
      private router: Router  , 
      private formBuilder: FormBuilder , 
      private detailsService :  DetailsService , 
      private localisation : LocalisationService ,
      private pickList : PickListService
      ) {
      this.myForm = new FormGroup({
        // fullName: new FormControl([Validators.required]),
        // sectorActivity: new FormControl( [Validators.required]),
        // apparenceYear: new FormControl('' , [Validators.required]),
        // email: new FormControl('', [Validators.required, Validators.email]),
        // phoneNumber: new FormControl( [Validators.required]),
        // website: new FormControl( [Validators.required]),

        // province: new FormControl( '' , [Validators.required]),
        // region: new FormControl( '' , [Validators.required]),
        // district: new FormControl( '' , [Validators.required]),
        // commune: new FormControl( '' ,  [Validators.required]),
        // ville: new FormControl('' , [Validators.required]), 
        // fokotany: new FormControl('' , [Validators.required]),
        // adresse: new FormControl('' , [Validators.required]),
      });
      }

      //*** Validation ***

   @ViewChild('myInput') myInput!: ElementRef;
   maxInputLength: number = 10;
 
   numberValidation(event: Event) {
     const inputElement: HTMLInputElement = this.myInput.nativeElement;
     if (inputElement.value.length > this.maxInputLength) {
       inputElement.value = inputElement.value.slice(0, this.maxInputLength);
     }
   }

      ngOnInit(): void {
        let token  = localStorage.getItem('token')!;
        let user = JSON.parse(localStorage.getItem('user')!);
        this.user = user;
        this.id = user.id;
        this.getDetails(user.id);
      }

      getDetails(id : string){
        if(this.user.type == 1){
          this.detailsService.getGiverDetailById(id , this.user.isProfessional).subscribe((response) => {
            this.getRegion();
            this.details = response ;
            this.details.phoneNumber = '0'+(this.details.phoneNumber).toString();
            console.log(this.details);
        });
        }
        else {
          this.detailsService.getUserDetailById(id).subscribe((response) => {
            this.getRegion();
            this.details = response ;
            this.details.phoneNumber = '0'+(this.details.phoneNumber).toString()
            let apparenceYear = new Date(this.details.apparenceYear) ;
            // this.apparenceYear = ""+ apparenceYear.getFullYear()+"-"+ apparenceYear.getMonth() +"-" + apparenceYear.getDate() ;
            // this.apparenceYear = ""+ this.details.apparenceYear+"-01-01";
            console.log(this.details);
        });
        }
      }

      getRegion(){
        this.pickList.pickList("ACTIVITY_SECTOR").subscribe(data => {
          console.log(data);
          this.sector_activity_list = data;
          this.load_sector_activity = true ;
          this.loadingInit();
        });
        this.localisation.getRegion().subscribe(data => {
          console.log(data);
          this.region = data ;
          this.regionR = data ;
          this.region = this.region.filter((element: any) => element.province == this.details.province);
          this.load_region = true ;
          this.loadingInit();
        });
        this.localisation.getDistrict().subscribe(data => {
          console.log(data);
          this.district = data ;
          this.districtR = data ;
          this.load_district = true ;
          this.loadingInit();
          this.district = this.district.filter((element) => element.region == this.details.region);
        });
        this.localisation.getCommune().subscribe(data => {
          console.log(data);
          this.commune = data ;
          this.communeR = data ;
          this.load_commune = true ;
          this.loadingInit();
          this.commune = this.commune.filter((element) => element.district == this.details.district);
        });
        
      }

      loadingInit(){
        if(this.load_region == true && this.load_district == true && this.load_commune == true && this.load_sector_activity ){
          this.loading = false ;
        }
      }
    
      changeProvince(event: Event) {
        let value = (event.target as HTMLSelectElement).value;
        this.region = this.regionR;
        this.region = this.region.filter((element) => element.province == value);
      }
    
      changeRegion(event: Event) {
        let value = (event.target as HTMLSelectElement).value;
        this.district = this.districtR;
        this.district = this.district.filter((element) => element.region == value);
      }
    
      changeDistrict(event: Event) {
        let value = (event.target as HTMLSelectElement).value;
        this.commune = this.communeR;
        this.commune = this.commune.filter((element) => element.district == value);
      }
    
      changeCommune(event: Event) {
        let value = (event.target as HTMLSelectElement).value;
        value = value.replace(/-/g, ' ');
        this.localisation.getFonkotany(value).subscribe(data => {
          console.log('Fonkontany :', data);
          this.fokotany = data ;
        });
      }

      sauvgardeInformation(){
        this.loading_update = true ;
        const year = document.getElementById('apparenceYear')as HTMLInputElement;
        // const fok = document.getElementById('fokotany')as HTMLInputElement;
        // let apparenceYear = new Date(year!.value).getFullYear() ;
        // let fokotany = fok!.value;
        this.details.password = "Testbe e";
        this.details.id = this.id;
        // this.details.apparenceYear = this.apparenceYear ;
        // this.details.fokotany = fokotany ;
        let phone = (this.details.phoneNumber).toString();
        console.log(phone);
        if(phone.length >= 10) {
          if(phone[0] == 0){
            console.log(phone[0]);
            this.details.phoneNumber = phone.substring(1);
          }
          else{
            this.details.phoneNumber = phone.slice(0, -1);
          }
        }
        else{
          this.details.phoneNumber = phone ;
        }
        console.log(this.details);
        this.error = false ;
        if(this.user.type == 1){
          !this.user.isProfessional ? this.updateParticularGiver() : this.updateProGiver() ;
        }
        else {
          this.updateReceicer()
        }
      }

      updateReceicer(){
        this.detailsService.updateReceiverMixte(this.details).subscribe(
          (response) => {
            console.log(response);
         }
         ,
         (error) =>{
           console.log(error)
           if(error.status == 200){
             this.getDetails(this.id);
             this.router.navigate(['/user/profile']);
           }
           else{this.error = true ;}
           this.loading_update = false ;
         }
        );
      }

      updateParticularGiver(){
        this.detailsService.updateParticularGiver(this.details).subscribe({
          next:(response) => {
            console.log(response);
         }
         ,
         error : (error) =>{
           console.log(error)
           if(error.status == 200){
             this.getDetails(this.id);
             this.router.navigate(['/user/profile']);
           }
           else{this.error = true ;}
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
         error :(error) => {
           console.log(error)
           if(error.status == 200){
             this.getDetails(this.id);
             this.router.navigate(['/user/profile']);
           }
           else{this.error = true ;}
           this.loading_update = false ;
         }
        });
      }

      retour(){
        this.router.navigate(['/user/profile']);
      }
  
}