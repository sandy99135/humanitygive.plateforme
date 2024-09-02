import { Injectable } from '@angular/core';
import { Donate } from '../models/donate.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map , forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonateService {

    uri: string = environment.URI;

    domain = [
        this.uri,'','*'
    ];

    constructor(protected http: HttpClient,) {}

  addDonate(donate : Donate) : Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.post<any>(this.uri + '/api/Donate/add', donate, { 'headers': headers }).pipe(
        map((x: HttpResponse<string>) => {
          return x.status;
        })
      );
  }

  updateDonate(donate : Donate) : Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.post<any>(this.uri + '/api/Donate/update/don', donate, { 'headers': headers }).pipe(
        map((x: HttpResponse<string>) => {
          return x.status;
        })
      );
  }

  setStatus(donateId : string , state : string) : Observable<any> { 
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.get<any>(this.uri + '/api/Donate/set/status?id=' + donateId + '&status=' + state , { 'headers': headers }).pipe(
        map((x: HttpResponse<string>) => {
          return x.status;
        })
      );
  }

  getById(Id : string) : Observable<any> { 
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.get<any>(this.uri + '/api/Donate/get?id='+ Id , { 'headers': headers });
  }


  getByGiverId(giverId : string) : Observable<any> { 
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.get<any>(this.uri + '/api/Donate/getByGiver?giverId=' + giverId , { 'headers': headers });
  }

  getByReceiverId(receiverId : string) : Observable<any> { 
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
      return this.http.get<any>(this.uri + '/api/Donate/getByReceiver?receiverId='+ receiverId , { 'headers': headers });
  }

  getAllDonate( global_filtre : string = "" , page: number = 0 ): Observable<any> {
    let params = {
      "page": page
    }
    
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Donate/all', params, { 'headers': headers });
  }

}