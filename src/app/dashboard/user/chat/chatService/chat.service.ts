import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { chatDetail, chatDiscution, chatMessage, updateChatMessage } from 'src/app/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {

    uri: string = environment.URI;
    uriChat: string = environment.URIChat;
    constructor(
    protected http: HttpClient
    ) {}

    domain = [
        this.uri,'','*'
    ];

    getDiscution(id : string) : Observable<chatDiscution[]> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        //.set('Access-Control-Allow-Origin', this.domain);
        return this.http.get<chatDiscution[]>(this.uriChat + '/api/Chat/message/discution?userId='+ id, { 'headers': headers })
    }
    // setDiscution() : Observable<chatDiscution[]> {
    //   const headers = new HttpHeaders()
    //     .set('content-type', 'application/json')
    //     .set('Access-Control-Allow-Origin', this.domain);
    //     return this.http.get<any>(this.uriChat + '/api/Chat/', { 'headers': headers })
    // }
    getDetail(sender : string , receiver : string) : Observable<chatDetail[]> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        //.set('Access-Control-Allow-Origin', this.domain);
        return this.http.get<chatDetail[]>(this.uriChat + '/api/Chat/message/all?receiver='+sender +'&sender=' + receiver, { 'headers': headers })
    }

    addMessage(message : chatMessage) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uriChat + '/api/Chat/message/send', message ,{ 'headers': headers })
    }

    UpdateMessage(message : updateChatMessage) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uriChat + '/api/Chat/message/update', message ,{ 'headers': headers }).pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }
}