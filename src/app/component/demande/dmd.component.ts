import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from './data';

@Component({
  selector: 'app-dmd',
  templateUrl: './dmd.component.html',
  styleUrls: ['./dmd.component.scss'],
})
export class DmdComponent implements OnInit {

  data : any[] = data ;

  constructor( private router: Router) {}

  ngOnInit(): void {
  }

  viewEvent(){
    this.router.navigate(['/event/show&public']);
  }

}