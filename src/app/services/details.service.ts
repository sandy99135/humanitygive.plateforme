import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

    uri: string = environment.URI;

    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
    ];

    getUserDetailById(id : string) : Observable<any> {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Access-Control-Allow-Origin', this.domain);
          return this.http.get<any>(this.uri + '/api/Auth/details/id?id='+ id , { 'headers': headers });
    }

    getGiverDetailById(id : string , isProfessional : boolean) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.get<any>(this.uri + '/api/Auth/details/id?id='+id+"&type=1&isProfessional="+isProfessional , { 'headers': headers });
  }

    updateReceiverMixte(data: any) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Receiver/update', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    updateParticularGiver(data: any) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/ParticularGiver/update', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    updateProGiver(data: any) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/ProfessionnelGiver/update', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

}
