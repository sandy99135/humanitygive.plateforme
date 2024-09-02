import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ResetMdp } from '../models/compte';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

    uri: string = environment.URI;

    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
    ];

    // ResetPassword(data : ResetMdp) : Observable<any> {
    //     const headers = new HttpHeaders()
    //       .set('content-type', 'application/json')
    //       .set('Access-Control-Allow-Origin', this.domain);
    //       return this.http.get<any>(this.uri + '/api/Auth/details/id?id='+ id , , { 'headers': headers });
    // }

    ResetPassword(data : ResetMdp) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Auth/password/reset', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

}