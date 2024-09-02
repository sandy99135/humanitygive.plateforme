// signalr.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { data } from '../../home/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection  =new HubConnectionBuilder()
  
  .withUrl("https://localhost:7191/chat")
  //.withUrl("https://localhost:44378/chatHub")
  .configureLogging(LogLevel.Information)
  .build();

  startConnection = () => {
    console.log("  this.hubConnection : ",  this.hubConnection);
    
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('https://localhost:44379/chatHub') // URL de votre hub SignalR
    //   .configureLogging(signalR.LogLevel.Information)
    //   .build();

    this.hubConnection
      .start()
      .then((e) => console.log('Connection started' ,e))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  // addReceiveMessageListener = ( callback :any) => {
  //   this.hubConnection?.on('ReceiveOne', callback);
  // }

  addReceiveMessageListener = () : Observable<any> => {
    return new Observable<string>((observer) => {
      this.hubConnection.on('ReceiveOne', (data: any) => {
        observer.next(data);
      });
    });
   
  }
   buildChatMessage(message: string,receiver:string ,sender :string) {
    console.log(this.hubConnection.connectionId);
    
    return {
      connectionId: this.hubConnection.connectionId,
      message: message,
      receiver : receiver,
      sender : sender

    };
  }
  getConnectionId() :any{
    return  this.hubConnection.connectionId?.toString();
  }

  sendMessage = (message: string,receiver:string ,sender :string) => {
    console.log("hubconnection  : ",this.hubConnection);
    
    this.hubConnection?.invoke('BroadcastAsync', this.buildChatMessage(message,receiver,sender))
      .catch(err => console.error('Error while sending message: ' + err));
  }
}
