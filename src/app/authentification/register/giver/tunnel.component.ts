import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { Particulier } from 'src/app/models/particulier.model';
import { Professionnel } from 'src/app/models/professionnel.model';
import {PAYS} from "../../../Data/pays"
import { LocalisationService } from 'src/app/services/localisation.component';

@Component({
  selector: 'app-tunnel-giver',
  templateUrl: './tunnel.component.html',
  styleUrls: ['./tunnel.component.scss'],
})
export class TunnelGiverComponent implements OnInit {

  pays : any[] = PAYS;
  type! : number ;
  etape : number = 0;
  error !: string ;
  error_send :  boolean = false;
  send_loading : boolean = false ;
  register : any = {
    email :"",
    denomination : "",
    adresse : ""
  };

  particulier_nom_form!: FormGroup;
  particulier_adresse_form!: FormGroup;
  particulier_mdp_form!: FormGroup;
  particulier_num_form!: FormGroup;

  pro_denomination_form!: FormGroup;
  pro_region_form!: FormGroup;
  pro_mdp_form!: FormGroup;
  pro_num_form!: FormGroup;

  showPassword1 : boolean = false ;
  showPassword2 : boolean = false ;

  province !: any[] ;
  region !: any[] ;
  district ! : any[] ;
  commune ! : any[] ;
  fokontany  : any[] = [];

  regionR !: any[] ;
  districtR ! : any[] ;
  communeR ! : any[] ;


  constructor( private router: Router , private registerService : RegisterService , private localisation : LocalisationService ) {

    this.particulier_nom_form = new FormGroup({
      'nom': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'prenom': new FormControl('', [Validators.required, Validators.minLength(3)]),
      // 'professionnalSituation': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.particulier_adresse_form = new FormGroup({
      'pays': new FormControl('Madagascar', [Validators.required, Validators.minLength(3)]),
      'province': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'region': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'district': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'commune': new FormControl('', [Validators.required]),
      'fokotany': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'adresse': new FormControl(''),
    });
    this.particulier_mdp_form = new FormGroup({
      'mdp': new FormControl('', [Validators.required , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
    });
    this.particulier_num_form = new FormGroup({
      'num': new FormControl('', ),
    });


    this.pro_denomination_form = new FormGroup({
      'denomination': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'secteur': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.pro_region_form = new FormGroup({
      'pays': new FormControl('Madagascar', [Validators.required, Validators.minLength(3)]),
      'province': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'region': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'district': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'commune': new FormControl('', [Validators.required]),
      'fokotany': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'adresse': new FormControl(''),
    });
    this.pro_mdp_form = new FormGroup({
      // At least 8 characters  , At least one uppercase letter , At least one lowercase letter , At least one digit
      'mdp': new FormControl('', [Validators.required , Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
      
    });

    this.pro_num_form = new FormGroup({
       'num': new FormControl(''),
     });

  }

  //*** Validation ***

  num_validation : boolean = false;

  @ViewChild('myInput') myInput!: ElementRef;
  maxInputLength: number = 10;

  numberValidation(event: Event) {
    this.num_validation = false;
    const inputElement: HTMLInputElement = this.myInput.nativeElement;
    if (inputElement.value.length >= this.maxInputLength) {
      inputElement.value = inputElement.value.slice(0, this.maxInputLength);
      this.num_validation = true;
    }
  }

  ngOnInit(): void {
    // localStorage.clear();
    this.etape = 0 ;
    this.register = JSON.parse(localStorage.getItem('register')!);
    console.log(this.register);
    if(localStorage.getItem('tunnel') !== null){
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!);
      console.log(tunnel);
      this.type = parseInt(tunnel.type) ;
      this.etape = parseInt(tunnel.etape) ;
    }
    this.getRegion();
  }

  getRegion(){
      let province = JSON.parse(localStorage.getItem('api_province')!);
      let region = JSON.parse(localStorage.getItem('api_region')!);
      let district = JSON.parse(localStorage.getItem('api_district')!);
      let commune = JSON.parse(localStorage.getItem('api_commune')!);
      
      this.province = province ;
      this.region = region ; this.regionR = region ;
      this.district = district ; this.districtR = district ;
      this.commune = commune ; this.communeR = commune ;
  }
  
  // ** Adress *** 

  mada_adresse : boolean = true ;

  changePays(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    value !== "Madagascar"  ? this.mada_adresse = false : this.mada_adresse = true ;
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
    if(data.length == 0) {
      this.fokontany = [{"name": value,"commune": "","id": ""}]
    }
    else {
      this.fokontany = data ;
    }
    console.log('Fonkontany :', this.fokontany);
    });
  }

  //  *** *** *** *** 

  choseType(value: number){
    this.type = value ;
    this.etape = 1 ;
    // this.register.compte_type = value ;
    let register = {
      email : this.register.email,
      compte : this.register.compte,
      notification : this.register.notification ,
      compte_type : value
    }
    this.register = register ;
    console.log(register);
    localStorage.setItem('register', JSON.stringify(register));
  }

  retour(){
    if(this.etape !== 0){
      this.etape -=1;
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!)
      localStorage.setItem('tunnel', JSON.stringify({type: tunnel.type , etape : this.etape}));
    }
    else {
      this.router.navigate(['auth/register/tunnel']);
    }
  }

  changeEtape(value : number){
    this.etape = value ;
  }

  updateRegister(formData : any , etape :number){
    this.register = { ...this.register, ...formData };
    localStorage.setItem('tunnel', JSON.stringify({type: this.type , etape : etape}));
    localStorage.setItem('register', JSON.stringify(this.register));
    this.etape = etape ;
    console.log(this.register);
  }

  sendParticulier(formData : any , etape :number){
    this.updateRegister(formData, etape);
    this.send_loading = true ;

    let particulier = new Particulier();
        particulier.email = this.register.email;
        particulier.type = this.register.compte;
        particulier.notification = this.register.notification;
        particulier.fullName = this.register.nom +' '+ this.register.prenom;
        particulier.sex =  this.register.sexe;
        // particulier.professionnalSituation = this.register.professionnalSituation;
        particulier.password =  this.register.mdp;
        particulier.phoneNumber = ''+ this.register.num;
        particulier.province = this.register.province;
        particulier.region = this.register.region;
        particulier.district = this.register.district;
        particulier.commune = this.register.commune;
        particulier.fokotany = this.register.fokotany;
        particulier.addresse = this.register.adresse;

    console.log('particulier :' , particulier );
    this.error_send = false;
    this.registerService.addGiverParticulier(particulier).subscribe(
      (data) => {
         console.log(data);
         this.send_loading = false ;
      }
      ,
      (error) =>{
        console.log(error)
        this.send_loading = false ;
        this.error = error.error;
        if(error.status == 200){
          this.router.navigate(['/auth/otp']);
        }
        else{
          this.error_send = true ;
        }
      }
    );
  }

  sendProfessionnel(formData : any , etape :number){
    this.updateRegister(formData, etape);
    this.send_loading = true ;
    let professionnel = new Professionnel();
        professionnel.email = this.register.email;
        professionnel.type = this.register.compte;
        professionnel.notification = this.register.notification;
        professionnel.fullName = this.register.denomination;
        professionnel.sectorActivity = this.register.secteur;
        professionnel.pays =  this.register.pays;
        professionnel.password =  this.register.mdp;
        professionnel.phoneNumber = ''+ this.register.num;
        professionnel.addresse = this.register.adresse;
        professionnel.province = this.register.province;
        professionnel.region = this.register.region;
        professionnel.district = this.register.district;
        professionnel.commune = this.register.commune;
        professionnel.fokotany = this.register.fokotany;
        professionnel.addresse = this.register.adresse;
    console.log('professionnel :' , professionnel );
    this.registerService.addGiverProfessionnel(professionnel).subscribe({
      next : (data) => {
        console.log(data);
        this.send_loading = false ;
     }
     ,
     error : (error) =>{
       console.log(error)
       this.send_loading = false ;
       this.error = error.error;
       if(error.status == 200){
         this.router.navigate(['/auth/otp']);
       }
     }
    });
  }

  // Tunnel particulier 

  particulier_nom_Submit(etape : number) {
    if (this.particulier_nom_form.valid) {
      const formData = this.particulier_nom_form.value;
      this.updateRegister(formData , etape);
    }
  }

  particulier_adresse_Submit(etape : number) {
    let value = this.particulier_adresse_form.value
    value.adresse == undefined ? value.adresse = '' : null
    if (this.particulier_adresse_form.valid) {
      const formData = value;
      this.updateRegister(formData , etape);
    }
    if(value.pays !== 'Madagascar') this.updateRegister(value , etape);
  }

  particulier_sexe_Submit(etape : number , value : number) {
    let formData = {sexe : value}
    this.updateRegister(formData , etape);
    
  }

  particulier_mdp_Submit(etape : number) {
    if (this.particulier_mdp_form.valid) {
      const formData = this.particulier_mdp_form.value;
      this.updateRegister(formData , etape);
    }
  }

  particulier_num_Submit() {
    if (this.particulier_num_form.valid) {
      const formData = this.particulier_num_form.value;
      let num = (formData.num).toString();
      if (num.length >= 10) formData.num = num.slice(0, 9);
      this.sendParticulier(formData , 5);
    }
  }

  // *** pro *** 

  pro_denomination_Submit(etape : number) {
    if (this.pro_denomination_form.valid) {
      const formData = this.pro_denomination_form.value;
      this.updateRegister(formData , etape);
    }
  }

  pro_region_Submit(etape : number) {
    let value = this.pro_region_form.value
    value.adresse == undefined ? value.adresse = '' : null
    if (this.pro_region_form.valid) {
      const formData = value;
      this.updateRegister(formData , etape);
    }
    if(value.pays !== 'Madagascar') this.updateRegister(value , etape);
  }

  pro_mdp_Submit(etape : number) {
    if (this.pro_mdp_form.valid) {
      const formData = this.pro_mdp_form.value;
      this.updateRegister(formData , etape);
    }
  }

  pro_num_Submit() {
    if (this.pro_num_form.valid) {
      const formData = this.pro_num_form.value;
      let num = (formData.num).toString();
      if (num.length >= 10) formData.num = num.slice(0, 9);
      
      this.sendProfessionnel(formData , 4);
    }
  }

}
