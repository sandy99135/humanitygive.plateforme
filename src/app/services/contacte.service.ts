import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ResetMdp } from '../models/compte';
import { ContacteModel } from '../models/contacte.model';

@Injectable({
  providedIn: 'root'
})
export class ContacteService {

    uri: string = environment.URI;

    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
    ];

    addContacteMessage(contact : ContacteModel) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Contact/add', contact, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    getMessage(): Observable<any> {
      let params = {
        "page": 1,
        "pageLength": 1000,
      }
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
      return this.http.post<any>(this.uri + '/api/Contact/all', params, { 'headers': headers });
    }

}