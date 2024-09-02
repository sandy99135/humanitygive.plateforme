import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {
    uri: string = environment.URI;
    constructor(
    protected http: HttpClient
    ) {}

    domain = [
      this.uri,'','*'
    ];

    getRegion() : Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.uri);
        return this.http.get<any>(this.uri + '/api/Madagascar/region/all', { 'headers': headers });
    }

    getDistrict() : Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.uri);
        return this.http.get<any>(this.uri + '/api/Madagascar/district/all', { 'headers': headers });
    }

    getCommune() : Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.uri);
        return this.http.get<any>(this.uri + '/api/Madagascar/commune/all', { 'headers': headers });
    }

    getFonkotany(commune : string) : Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.uri);
        return this.http.get<any>(this.uri + '/api/Madagascar/fokotany/all?commune='+commune, { 'headers': headers });
    }
}
