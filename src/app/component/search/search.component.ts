import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

    public formGroup!: FormGroup;
    denomination!: FormControl;
    Region!: FormControl;
    Ville!: FormControl;
    Quartier!: FormControl;

  constructor( private router: Router ) {}

  ngOnInit(): void {
  
  }

  
}