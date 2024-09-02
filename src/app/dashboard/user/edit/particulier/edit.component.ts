import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-edit-particulier',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditParticulierComponent implements OnInit {

    user : any = {
        nom : "Lantonaina",
        prenom :"Test"
    }

    myForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
          nom: ['John', Validators.required], 
          prenom: ['Lantoniaina', Validators.required], 
          sexe: ['Homme', Validators.required], 
          date: ['xx/xx/xxxx', Validators.required], 
          adresse: ['2F Bis TEST', Validators.required],
          email: ['test@gmail.com', [Validators.required, Validators.email]],
        });
      }

  ngOnInit(): void {
  
  }

  
}