import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalisationService } from 'src/app/services/localisation.component';
import { ReceiverMixte } from 'src/app/models/ReceiverMixte.model';
import { RegisterService } from 'src/app/services/register.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-tunnel-receiver',
  templateUrl: './tunnel.component.html',
  styleUrls: ['./tunnel.component.scss'],
})
export class TunnelReceiverComponent implements OnInit {

  etape: number = 1;
  register!: any;
  send_loading: boolean = false;
  error!: string;
  error_send :  boolean = false;
  secteurs !: any[];

  denomination_form!: FormGroup;
  adresse_form!: FormGroup;
  annee_form!: FormGroup;
  mdp_form!: FormGroup;
  num_form!: FormGroup;

  province !: any[];
  region !: any[];
  district !: any[];
  commune !: any[];
  fokontany: any[] = [];

  regionR !: any[];
  districtR !: any[];
  communeR !: any[];

  showPassword: boolean = false;

  constructor(
    private router: Router,
    private localisation: LocalisationService,
    private registerService: RegisterService,
  ) {

    this.denomination_form = new FormGroup({
      'denomination': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'secteur': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.adresse_form = new FormGroup({
      'province': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'region': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'district': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'commune': new FormControl('', [Validators.required]),
      'fokotany': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'adresse': new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
    this.annee_form = new FormGroup({
      'annee': new FormControl('', [Validators.required]),
    });
    this.mdp_form = new FormGroup({
      'mdp': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]),
    });
    this.num_form = new FormGroup({
      'num': new FormControl(''),
    });
  }

  //*** Validation ***

  num_validation: boolean = false;

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

  //  *** ***

  ngOnInit(): void {
    //  localStorage.clear();
    this.etapeAndRegisterInit();
    this.getRegion()
  }

  getRegion() {
    let province = JSON.parse(localStorage.getItem('api_province')!);
    let region = JSON.parse(localStorage.getItem('api_region')!);
    let district = JSON.parse(localStorage.getItem('api_district')!);
    let commune = JSON.parse(localStorage.getItem('api_commune')!);
    this.secteurs = JSON.parse(localStorage.getItem('activity_sector')!);
    console.log(this.secteurs);
    
    this.province = province;
    this.region = region; this.regionR = region;
    this.district = district; this.districtR = district;
    this.commune = commune; this.communeR = commune;
  }

  // *** Adress *** 

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
    // let value = (event.target as HTMLSelectElement).value;
    // value = value.replace(/-/g, ' ');
    // this.localisation.getFonkotany(value).subscribe(data => {
    //   console.log('Fonkontany :', data);
    //   this.fokontany = data ;
    // });

    let value = (event.target as HTMLSelectElement).value;
    value = value.replace(/-/g, ' ');
    this.localisation.getFonkotany(value).subscribe(data => {
      if (data.length == 0) {
        this.fokontany = [{ "name": value, "commune": "", "id": "" }]
      }
      else {
        this.fokontany = data;
      }
      console.log('Fonkontany :', this.fokontany);
    });
  }

  // ******

  etapeAndRegisterInit() {
    this.register = JSON.parse(localStorage.getItem('register')!);
    if (localStorage.getItem('tunnel') !== null) {
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!)
      console.log(tunnel);
      if (parseInt(tunnel.etape) == 0) {
        this.etape = 1;
      }
      else {
        this.etape = parseInt(tunnel.etape);
      }
    }

    if (this.etape == 1) {
      let register = {
        email: this.register.email,
        compte: this.register.compte,
        notification: this.register.notification,
      }
      this.register = register;
      console.log(register);
      localStorage.setItem('register', JSON.stringify(register));
    }
    console.log(this.register);
  }

  changeEtape(value: number) {
    this.etape = value;
  }

  retour() {
    if (this.etape !== 1) {
      this.etape -= 1;
      let tunnel = JSON.parse(localStorage.getItem('tunnel')!)
      localStorage.setItem('tunnel', JSON.stringify({ type: tunnel.type, etape: this.etape }));
    }
    else {
      this.router.navigate(['auth/register/tunnel']);
    }
  }

  updateRegister(formData: any, etape: number) {
    this.register = { ...this.register, ...formData };
    localStorage.setItem('tunnel', JSON.stringify({ etape: etape }));
    localStorage.setItem('register', JSON.stringify(this.register));
    this.etape = etape;
    console.log(this.register);
  }

  sendReceiver(formData: any, etape: number) {
    this.updateRegister(formData, etape);
    this.send_loading = true;
    console.log('Data :', this.register);

    let Receiver = new ReceiverMixte();
    Receiver.email = this.register.email;
    Receiver.type = this.register.compte;
    Receiver.notification = this.register.notification;
    Receiver.fullName = this.register.denomination;
    Receiver.apparenceYear = this.register.annee;
    Receiver.sectorActivity = this.register.secteur;
    Receiver.province = this.register.province;
    Receiver.region = this.register.region;
    Receiver.district = this.register.district;
    Receiver.commune = this.register.commune;
    Receiver.fokotany = this.register.fokotany;
    Receiver.addresse = this.register.adresse;
    Receiver.password = this.register.mdp;
    Receiver.phoneNumber = '' + this.register.num;

    console.log('Receiver :', Receiver);
    this.error_send = false;
    this.registerService.addReceiverMixte(Receiver).subscribe(
      (data) => {
        console.log(data);
        this.send_loading = false;
      }
      ,
      (error) => {
        console.log(error)
        this.send_loading = false;
        this.error = error.message;
        if (error.status == 200) {
          this.router.navigate(['/auth/otp']);
        }
        else{
          this.error_send = true ;
        }
      }
    );
  }

  denomination_Submit(etape: number) {
    if (this.denomination_form.valid) {
      const formData = this.denomination_form.value;
      this.updateRegister(formData, etape);
    }
  }

  adresse_Submit(etape: number) {
    if (this.adresse_form.valid) {
      const formData = this.adresse_form.value;
      this.updateRegister(formData, etape);
    }
  }

  date_error: boolean = false;
  annee_Submit(etape: number) {
    this.date_error = false;
    if (this.annee_form.valid) {
      const formData = this.annee_form.value;
      let dateAComparer = new Date(formData.annee);
      let dateActuelle = new Date();
      if (dateAComparer < dateActuelle) {
        this.updateRegister(formData , etape);
      }
      else {
        this.date_error = true;
      }
    }
  }

  mdp_Submit(etape: number) {
    if (this.mdp_form.valid) {
      const formData = this.mdp_form.value;
      this.updateRegister(formData, etape);
    }
  }

  num_Submit() {
    const formData = this.num_form.value;
    if ((formData.num).toString().length == 10) {
      formData.num = parseInt((formData.num).toString().slice(0, -1));
    }
    this.sendReceiver(formData, 5);
  }

}
