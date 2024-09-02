import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Particulier } from '../models/particulier.model';
import { Professionnel } from '../models/professionnel.model';
import { ReceiverMixte } from '../models/ReceiverMixte.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
    uri: string = environment.URI;

    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
      ];

    otpGenerate( email :  string) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.get<any>(this.uri + '/api/Otp/regenerate?email=' + email , { 'headers': headers });
    }

    otpValidation(otp : string , email :  string) : Observable<any> {
      let data = {
        otp : otp ,
        email: email
      }
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Otp/validate', data , { 'headers': headers });
    }
    
    addGiverParticulier(particulier : Particulier) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/ParticularGiver/add', particulier , { 'headers': headers }).pipe(
          map((x: HttpResponse<string>) => {
            // if(x.status !== 200){
            //   throw new Error(x.body!.toString());,
            // }
            // if ( x.status == 202) {
              
            // }
            return x.status;
          })
        );
    }

    addGiverProfessionnel(professionnel : Professionnel) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/ProfessionnelGiver/add', professionnel , { 'headers': headers }).pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    addReceiverMixte(receiver : ReceiverMixte) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Receiver/add', receiver , { 'headers': headers }).pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

}
