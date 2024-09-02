import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  uri: string = environment.URI;
  constructor(
    protected http: HttpClient
    ) {}

  domain = [
      this.uri,'','*'
    ];

  authenticate(login: any) : Observable<any>{
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', this.domain);
    return this.http.post(this.uri + '/api/Auth/login', login, { 'headers': headers });
  }

  //Inscription
  async signup(signupData: Login): Promise<Observable<any>>{
    const headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', this.domain);

    return this.http.post(this.uri+ 'Signup',signupData, { 'headers': headers } );
  }

}
