import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { province } from '../data/province';
import { LocalisationService } from 'src/app/services/localisation.component';
import { ReceiverMixte } from 'src/app/models/ReceiverMixte.model';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-tunnel-mixte',
  templateUrl: './tunnel.component.html',
  styleUrls: ['./tunnel.component.scss'],
})
export class TunnelMixteComponent implements OnInit {

  
  etape : number = 1;
  register! : any;
  send_loading : boolean = false ;
  error! : string ;

  denomination_form!: FormGroup;
  adresse_form!: FormGroup;
  annee_form!: FormGroup;
  mdp_form!: FormGroup;
  num_form!: FormGroup;

  loading : boolean = true;
  load_region : boolean = false ;
  load_district : boolean = false ;
  load_commune : boolean = false ;

  province : any[] = province ;
  region !: any[] ;
  district ! : any[] ;
  commune ! : any[] ;
  fokontany  : any[] = [];

  regionR !: any[] ;
  districtR ! : any[] ;
  communeR ! : any[] ;

  constructor( private router: Router , private localisation : LocalisationService ,  private registerService : RegisterService) {

    this.denomination_form = new FormGroup({
      'denomination': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'secteur': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.adresse_form = new FormGroup({
      'province': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'region': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'district': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'commune': new FormControl('', [Validators.required]),
      // 'ville': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'fokotany': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'adresse': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.annee_form = new FormGroup({
      'annee': new FormControl('', [Validators.required]),
    });
    this.mdp_form = new FormGroup({
      'mdp': new FormControl('',  [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
    });
    this.num_form = new FormGroup({
      'num': new FormControl('',  [Validators.required, Validators.pattern('^[0-9]{10}$')]),
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
    //  localStorage.clear();
    this.etapeAndRegisterInit();
    
    this.localisation.getRegion().subscribe(data => {
      console.log(data);
      this.region = data ;
      this.regionR = data ;
      this.load_region = true ;
      this.loadingInit();
    });
    this.localisation.getDistrict().subscribe(data => {
      console.log(data);
      this.district = data ;
      this.districtR = data ;
      this.load_district = true ;
      this.loadingInit();
    });
    this.localisation.getCommune().subscribe(data => {
      console.log(data);
      this.commune = data ;
      this.communeR = data ;
      this.load_commune = true ;
      this.loadingInit();
    });
  }

  // ngAfterViewInit(){
  //   this.loading = false ;
  // }

  loadingInit(){
    if(this.load_region == true && this.load_district == true && this.load_commune == true  ){
      this.loading = false ;
    }
  }

    // ** Adress *** 

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
        this.fokontany = data ;
      });
    }
  
    // **************

  etapeAndRegisterInit(){
    this.register = JSON.parse(localStorage.getItem('register')!);
    if(localStorage.getItem('tunnel') !== null){
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!)
      console.log(tunnel);
      if(parseInt(tunnel.etape) == 0 ) {
        this.etape = 1;
      }
      else {
        this.etape = parseInt(tunnel.etape) ;
      }
    }
    
    if(this.etape == 1){
      let register = {
        email : this.register.email,
        compte : this.register.compte,
        notification : this.register.notification,
      }
       this.register = register ;
       console.log(register);
       localStorage.setItem('register', JSON.stringify(register));
    }
  }

  changeEtape(value : number){
    this.etape = value ;
  }

  retour(){
    if(this.etape !== 1) {
      this.etape -=1;
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!)
      localStorage.setItem('tunnel', JSON.stringify({type: tunnel.type , etape : this.etape}));
    }
    else  {
      this.router.navigate(['auth/register/tunnel']);
    }
  }
  
  updateRegister(formData : any , etape :number){
    this.register = { ...this.register, ...formData };
    localStorage.setItem('tunnel', JSON.stringify({etape : etape}));
    localStorage.setItem('register', JSON.stringify(this.register));
    this.etape = etape ;
    console.log(this.register);
  }

  sendMixte(formData : any , etape :number){
    this.updateRegister(formData, etape);
    this.send_loading = true ;
    let Receiver = new ReceiverMixte();
        Receiver.email = this.register.email;
        Receiver.type = this.register.compte;
        Receiver.notification = this.register.notification;
        Receiver.fullName = this.register.denomination;
        Receiver.apparenceYear = new Date(this.register.annee).getFullYear() ;
        Receiver.sectorActivity = this.register.secteur;
        Receiver.province = this.register.adresse.province;
        Receiver.region = this.register.adresse.region;
        Receiver.district = this.register.adresse.district;
        Receiver.commune = this.register.adresse.commune;
        Receiver.fokotany = this.register.adresse.fokotany;
        Receiver.addresse = this.register.adresse.adresse;
        Receiver.password =  this.register.mdp;
        Receiver.phoneNumber = ''+ this.register.num;

    console.log('Receiver :' , Receiver );
    console.log('Receiver :' , Receiver );
    this.registerService.addReceiverMixte(Receiver).subscribe(
      (data) => {
         console.log(data);
         this.send_loading = false ;
      }
      ,
      (error) =>{
        console.log(error)
        this.send_loading = false ;
        this.error = error.message;
        if(error.status == 200){
          this.router.navigate(['/auth/otp']);
        }
      }
    );
  }

  denomination_Submit(etape : number) {
    if (this.denomination_form.valid) {
      const formData = this.denomination_form.value;
      this.updateRegister(formData , etape);
    }
  }

  adresse_Submit(etape : number) {
    if (this.adresse_form.valid) {
      const formData = this.adresse_form.value;
      this.updateRegister({adresse : formData} , etape);
    }
  }

  annee_Submit(etape : number) {
    if (this.annee_form.valid) {
      const formData = this.annee_form.value;
      this.updateRegister(formData , etape);
    }
  }

  mdp_Submit(etape : number) {
    if (this.mdp_form.valid) {
      const formData = this.annee_form.value;
      this.updateRegister(formData , etape);
    }
  }

  num_Submit() {
    const formData = this.num_form.value;
    if((formData.num).toString().length == 10) {
      formData.num = parseInt((formData.num).toString().slice(0, -1));
    }
    this.sendMixte(formData , 5);
  }



}
