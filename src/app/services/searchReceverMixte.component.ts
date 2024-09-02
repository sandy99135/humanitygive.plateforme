import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { NearReceiverModel } from '../models/ReceiverMixte.model';

@Injectable({
  providedIn: 'root'
})
export class searchReceiverMixteComponent {

  uri: string = environment.URI;

  constructor(
    protected http: HttpClient
  ) { }

  domain = [
    this.uri, '', '*'
  ];

  // Admin ***

  getAllUser( global_filtre : any , page: number = 1 ): Observable<any> {
    let params = {
      "page": page,
      "pageLength": 1000,
      "filters": global_filtre
    }
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Auth/all/user', params, { 'headers': headers });
  }

  searchAdmin( global_filtre : string , search_params: any, page: number = 0 ): Observable<any> {
    let params = {
      "page": page,
      "search": search_params,
    }
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Auth/all', params, { 'headers': headers });
  }

  // *** *** *

  getReceiverMixte(page: number = 1): Observable<any> {
    let params = {
      "page": page,
      "pageLength": 2,
      "filters": [
        {
          "key": "type",
          "value": "RECEIVER"
        },
        {"key": "isValid","value": "true"}
      ]
    }
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Auth/all', params, { 'headers': headers });
  }


  searchReceiverMixte(search_params: any, page: number = 0): Observable<any> {
    let params = {
      "page": page,
      "pageLength": 1000,
      "filters": [
        {"key": "Type","value": "RECEIVER"},
        {"key": "isValid","value": "true"}
      ],
      "search": search_params
    }
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Auth/all', params, { 'headers': headers });
  }

  getNearReceiver(data : NearReceiverModel): Observable<any> {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post<any>(this.uri + '/api/Auth/all', data , { 'headers': headers });
  }


}
