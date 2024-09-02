import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrenchHolidaysService {
  uri: string = environment.URI;
  constructor(
    protected http: HttpClient
    ) {}

    GetFerie() : Observable<Date[]> {
      let domain = [
        this.uri
      ];
      const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', domain);
      return this.http.get<Date[]>(this.uri + 'GetJourFerie/', { 'headers': headers });
    }

    GetNbJourFerie(debut: Date, fin : Date) : Observable<number> {
      let domain = [
        this.uri
      ];
      const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', domain);
      return this.http.get<number>(this.uri + 'GetNbJourFerie/'+debut+'/'+fin, { 'headers': headers });
    }
}
