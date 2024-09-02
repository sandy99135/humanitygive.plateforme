import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { searchReceiverMixteComponent } from 'src/app/services/searchReceverMixte.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'giver-preview-list',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class GiverPreviewListeComponent implements OnInit {

  url : string = environment.URI + "/api/File/readImage?";
  data !: any[] ;
  total!: number;
  global_filtre : any = [
    {
      "key": "type",
      "value": "GIVER"
    },
    {"key": "isValid","value": "true"}
  ];

  constructor( 
    private router: Router  , 
    private location: Location ,
    private RCService: searchReceiverMixteComponent, ) {}

  ngOnInit(): void {
    let preview_giver_liste = localStorage.getItem('preview_giver_liste')!;
    preview_giver_liste != null ? this.data = JSON.parse(preview_giver_liste) : this.getAllUser();
  }

  getAllUser(){
      this.RCService.getAllUser(this.global_filtre,0).subscribe((response:any) => {
        this.data = response.data.slice(0, 4);
        this.total = response.total;
        localStorage.setItem('preview_giver_liste', JSON.stringify(response.data.slice(0, 4)));
        console.log("Giver",response.data);
      });
  }

  imageUrl( name : string , type : string){
    return this.url + "fileName=" + name + "&type=" + type ;
  }

  voirListeGiver(){
    this.router.navigate(['/user/home/giver'])
  }

}
