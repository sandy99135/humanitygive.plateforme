import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { data } from './data';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.scss'],
})
export class RechercheComponent implements OnInit {

  data : any[] = data ;

  constructor( private router: Router ) {}

  ngOnInit(): void {
  
  }

  
}
