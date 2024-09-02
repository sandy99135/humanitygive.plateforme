import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ContacteService } from 'src/app/services/contacte.service';
import { ContacteModel } from 'src/app/models/contacte.model';

@Component({
  selector: 'contacte',
  templateUrl: './contacte.component.html',
  styleUrls: ['./contacte.component.scss'],
})
export class ContacteComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  error_message !: string | null;
  error_succes !: string | null;

  name !: string;
  email !: string;
  phoneNumber!: string;
  message!: string;

  constructor(
    private router: Router,
    private location: Location,
    private contacteMessage: ContacteService
  ) { }

  ngOnInit(): void {

  }

  addContactMessage() {
    let data: ContacteModel = {
      fullName: this.name,
      email: this.email,
      phoneNumber: this.num_validation ? 
                  (this.phoneNumber)!.toString() : "",
      message: this.message
    }
    console.log(data);
    this.loading = true;
    this.contacteMessage.addContacteMessage(data).subscribe({
      next : (data) => { console.log(data); this.loading = false; }
      ,
      error : (error) => {
        console.log(error)
        this.loading = false;
        if (error.status == 200) {
          this.error_succes = "Votre message a été bien envoyé";
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        }
        else {
          this.error_message = "Erreur du serveur , veuillez réesayer";
        }
        this.loading = false;
      }
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

  validation() {
    this.error_message = null;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.name || this.name.trim() === "") {
      this.error_message = "Votre Nom est obligatoire"
    }
    else if (!this.email && !this.phoneNumber) {
      this.error_message = "Veuillez entrer votre Email ou Numero de téléphone"
    }
    else {
      if (this.email) {
        if (!emailRegex.test(this.email)) {
          this.error_message = "Veuillez entrer une email valide"
          return 
        }
      }
      if (this.phoneNumber) {
        if (this.num_validation == false) {
          this.error_message = "Numero de téléphone doit etre a 10 caracteres"
          return 
        }
      }
      if (!this.message || this.message.trim() === "") {
        this.error_message = "Veuilez entrer un Message"
        return
      }
      console.log("Send");
      
      this.addContactMessage()
    }
  }

  

}