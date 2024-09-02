import { Publication } from './../models/publication';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collaborateur } from '../models/collaborateur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  constructor(private http: HttpClient) { }
  uri: string = environment.URI;

  getPublication() {
    return this.http.get<Publication[]>(this.uri+"api/Publication");
  }
}
