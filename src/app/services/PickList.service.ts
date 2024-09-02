import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PickListService {
    uri: string = environment.URI;
    constructor(
    protected http: HttpClient
    ) {}

    domain = [
      this.uri,'','*'
    ];

    pickList(type : string) : Observable<any> {
        const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.uri);
        return this.http.get<any>(this.uri + '/api/PickList/get?type='+ type, { 'headers': headers });
    }

}
