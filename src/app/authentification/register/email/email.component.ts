import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { province } from '../data/province';
import { LocalisationService } from 'src/app/services/localisation.component';
import { PickListService } from 'src/app/services/PickList.service';

@Component({
  selector: 'app-register-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class RegisterEmailComponent implements OnInit {

  myForm!: FormGroup;
  notification: boolean = true ;

  loading : boolean = true;
  load_region : boolean = false ;
  load_district : boolean = false ;
  load_commune : boolean = false ;
  loading_activity_sector:  boolean = false ;

  constructor( 
    private router: Router , 
    private localisation : LocalisationService,
    private pickList : PickListService
    ) {
    this.myForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    // localStorage.clear();
    this.getActivitySector();
    this.getRegion();
  }

  onSubmit() {
    if (this.myForm.valid) {
      let formData = this.myForm.value;
      console.log(formData);
      formData = { ...formData, ...{notification : this.notification}};
      localStorage.setItem('register', JSON.stringify(formData));
      this.router.navigate(['auth/register/tunnel']);
    }
  }

  getActivitySector(){
    this.pickList.pickList("ACTIVITY_SECTOR").subscribe(data => {
      console.log(data);
      localStorage.setItem('activity_sector', JSON.stringify(data));
      this.loading_activity_sector = true ;
      this.loadingInit();
    });
  }

  getRegion(){
    localStorage.setItem('api_province', JSON.stringify(province));
    this.localisation.getRegion().subscribe(data => {
      console.log(data);
      localStorage.setItem('api_region', JSON.stringify(data));
      this.load_region = true ;
      this.loadingInit();
    });
    this.localisation.getDistrict().subscribe(data => {
      console.log(data);
      localStorage.setItem('api_district', JSON.stringify(data));
      this.load_district = true ;
      this.loadingInit();
    });
    this.localisation.getCommune().subscribe(data => {
      console.log(data);
      localStorage.setItem('api_commune', JSON.stringify(data));
      this.load_commune = true ;
      this.loadingInit();
    });
  }

  loadingInit(){
    if(this.load_region && this.load_district && this.load_commune && this.loading_activity_sector){
      this.loading = false ;
    }
  }

  notifier() {
    this.notification = ! this.notification ;
  }

  login(){
    this.router.navigate(['auth/login/email']);
  }
  
}
