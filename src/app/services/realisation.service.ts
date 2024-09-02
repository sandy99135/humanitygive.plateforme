import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RealisationData, RealisationRemove, RealisationUpdate } from '../models/realisation.model';

@Injectable({
  providedIn: 'root'
})
export class RealisationService {

    uri: string = environment.URI;

    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
    ];

    addRealisation(data: RealisationData) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Realisation/add', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    removeRealisation(data: RealisationRemove) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Realisation/remove', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    updateRealisation(data: RealisationUpdate) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/Realisation/update', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

}
