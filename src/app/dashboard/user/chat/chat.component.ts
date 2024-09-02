import { Component, OnInit } from '@angular/core';
import { emoji, reactions } from './data';
import { chatDetail, chatDiscution, chatHeadDetail, chatMessage, updateChatMessage } from 'src/app/models/chat.model';
import { DateService } from 'src/app/services/date.service';
import { ChatMessageService } from './chatService/chat.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SignalRService } from './chatService/hub.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  message!: chatDetail[];
  send_text !: string;
  url: string = environment.URI + "/api/File/readImage?";

  selected: number = 0;
  discu_view: boolean = true;
  detail: boolean = false;
  mobile: boolean = false;

  emoji: string[] = emoji;
  emoji_view: boolean = false;
  outside_box_emoji: boolean = false;

  reactions: string[] = reactions;
  show_reaction: boolean = false;

  delete_discution: boolean = false;
  outside_delete_discution: boolean = false;

  delete_discution_comfirme: boolean = false;
  outside_delete_discution_comfirme: boolean = false;

  delete_msg: boolean = false;
  outside_delete_msg: boolean = false;

  delete_msg_comfirme: boolean = false;
  outside_delete_msg_comfirme: boolean = false;

  discutions !: chatDiscution[];
  discutionsR !: chatDiscution[];
  discution_profil: chatHeadDetail = {
    profilImage: "",
    name: "",
    contactId: ""
  }
  userId !: string;
  from_profil_contact: boolean = false;

  loading : boolean = true ;
  loading_detail : boolean = false ;
  search : boolean = false ;


  constructor(
    private dService: DateService,
    private chatService: ChatMessageService,
    private router: Router,
    private signalRService: SignalRService
  ) {

  }

  ngOnInit(): void {
    let userId = JSON.parse(localStorage.getItem('user')!).id;
    this.userId = userId;
    const discution_profil: chatHeadDetail = JSON.parse(localStorage.getItem('discution_profil')!)
    this.signalRService.startConnection();
    this.signalRService.addReceiveMessageListener( ).subscribe((data : any)=>{
      console.log(data);
      if (discution_profil) {
        this.fromProfilContact(discution_profil);
       localStorage.removeItem('discution_profil')
     }
     else {
       this.getDiscution(userId);
     }
      //this.fromProfilContact(discution_profil);
      
    });
 
    this.mobileScreen();
    
    
    if (discution_profil) {
       this.fromProfilContact(discution_profil);
      localStorage.removeItem('discution_profil')
    }
    else {
      this.getDiscution(userId);
    }
    if (this.detail == true) this.scrollToBottom();
  }

  fromProfilContact(discution_profil: chatHeadDetail) {
    this.from_profil_contact = true;
    this.discution_profil = discution_profil;
    console.log(this.discution_profil);
    this.chatService.getDiscution(this.userId).subscribe({
      next: (data) => {
        if (data.length != 0) {
          this.discutions = data;
          this.discutionsR = data;
          let index = data.findIndex((d: chatDiscution) => d.contactId === discution_profil.contactId)!;
          console.log(index);
          console.log(data)
          if (index !== -1 && index !== undefined && index !== null) {
            this.detail = true;
            if (!this.mobile) this.selected = index
            if (this.mobile) this.discu_view = false
            this.getDetail(this.userId, data[index]);
          }
          else {
            this.selected = -1;
            this.detail = true;
            if (this.mobile) this.discu_view = false
            this.loading = false;
          }
        }
        else {
          this.discutions = Array<chatDiscution>();
          this.detail = true;
          this.search = false;
          if (this.mobile) this.discu_view = false;
          this.loading = false;
        }
      },
      error: (error) => {
        console.log(error) ;
        this.loading = false;
      }
    })
    // this.getSimpleDetail(this.userId , discution_profil.contactId , true);
  }

  getDiscution(userId: string , send :  boolean = false) {
    this.chatService.getDiscution(userId).subscribe({
      next: (data) => {
        if (data.length != 0) {
          this.discutions = data;
          this.discutionsR = data;
          if(send){
            this.selected = 0 ;
            this.send_text = "";
          }
          this.getDetail(this.userId, data[0]);
          console.log(data)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getDiscutionSimple(userId: string) {
    this.chatService.getDiscution(userId).subscribe({
      next: (data) => {
        if (data.length != 0) {
          this.discutions = data;
          this.discutionsR = data;
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getDetail(sender: string, discution: chatDiscution) {
    this.chatService.getDetail(sender, discution.contactId).subscribe({
      next: (data) => {
        this.message = data;
        this.discution_profil.profilImage = discution.profil! ? this.imageUrl(discution.profil!.name, discution.profil!.type) : null;
        this.discution_profil.name = discution.name;
        this.discution_profil.contactId = discution.contactId;
        this.loading = false;
        this.loading_detail = false;
        setTimeout(() => { this.scrollToBottom(); }, 50);
        console.log(data)
      },
      error: (error) => {
        this.loading = false;
        this.loading_detail = false;
        console.log(error)
      }
    })
  }

  getSimpleDetail(sender: string, receiver: string, init: boolean = false) {
    this.chatService.getDetail(sender, receiver).subscribe({
      next: (data) => {
        this.message = data;
        setTimeout(() => { this.scrollToBottom(); }, 50);
        console.log(data)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  mobileScreen() {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);
    if (screenWidth < 1000) {
      this.selected = -1;
      this.mobile = true;
      this.detail = false;
    }
    else {
      this.detail = true;
    }
  }

  scrollToBottom(): void {
    let content = document.getElementById("content")!;
    console.log("content : ", content);
    
    content!.scrollTop = content!.scrollHeight;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  // ngOnDestroy() {
  //   localStorage.removeItem('discution_profil')
  // }

  imageUrl(name: string, type: string) {
    return this.url + "fileName=" + name + "&type=" + type;
  }

  selecteDiscution(discution: chatDiscution, index: number) {
    this.loading_detail = true ;
    this.detail = true;
    if (!this.mobile) this.selected = index;
    if (this.mobile) this.discu_view = false;
    // localStorage.removeItem('discution_profil')
    this.getDetail(this.userId, discution);
  }

  changeSearch(event: any) {
    this.search = true;
    let value = event.target.value;
    this.discutions = this.discutionsR;
    console.log(value);

    value.trim() == "" ?
      this.discutions = this.discutionsR :
      this.discutions = this.discutions.filter(d => d.name.toUpperCase().includes(value.toUpperCase()))
  }

  mobilDetailRetourn() {
    this.discu_view = true;
    this.detail = false;
    // localStorage.removeItem('discution_profil')
    this.discutions = this.discutionsR;
    if (this.discutions.length == 0 || !this.discutions) this.router.navigate(['/user/home/association']);
  }

  deleteDiscution() {
    if (!this.delete_discution) { this.delete_discution = true; setTimeout(() => { this.outside_delete_discution = true; }, 50); }
    else { this.delete_discution = false; this.outside_delete_discution = false; }
  }
  outsideDeleteDiscution() {
    if (this.outside_delete_discution) {
      this.delete_discution = false;
      this.outside_delete_discution = false;
    }
  }

  deleteDiscutionComfirme() {
    this.delete_discution = false;
    this.outside_delete_discution = false;
    if (!this.delete_discution_comfirme) { this.delete_discution_comfirme = true; setTimeout(() => { this.outside_delete_discution_comfirme = true; }, 50); }
    else { this.delete_discution_comfirme = false; this.outside_delete_discution_comfirme = false; }
  }
  outsideDeleteDiscutionComfirme() {
    if (this.outside_delete_discution_comfirme) {
      this.delete_discution_comfirme = false;
      this.outside_delete_discution_comfirme = false;
    }
  }

  deleteMessage(message : chatDetail) {
    localStorage.setItem('message_to_delete', JSON.stringify(message) );
    this.delete_msg = false;
    this.outside_delete_msg = false;
    if (!this.delete_msg_comfirme) { this.delete_msg_comfirme = true; setTimeout(() => { this.outside_delete_msg_comfirme = true; }, 50); }
    else { this.delete_msg_comfirme = false; this.outside_delete_msg_comfirme = false; }
  }
  outsideDeleteMsgComfirme() {
    if (this.outside_delete_msg_comfirme) {
      this.delete_msg_comfirme = false;
      this.outside_delete_msg_comfirme = false;
    }
  }
  deleteMsgComfirme(){
    let message : updateChatMessage = JSON.parse(localStorage.getItem('message_to_delete')!);
    console.log(message);
    message.etat = 0 ;
    this.updateMessage(message , 0);
  }

  // 0 : delete / 1 : reaction / 2 : contenu
  updateMessage(message : updateChatMessage , target : number){
    this.chatService.UpdateMessage(message).subscribe({
      next: (data)=>{
        if(target == 0) this.okUpdate(message);
      },
      error: (error)=>{
        console.log(error);
        if(error.status == 200){
          if(target == 0)this.okUpdate(message);
        }
        else{
          this.delete_msg_comfirme = false ; this.outside_delete_msg_comfirme = false
        }
      }
    })
  }

  okUpdate(message : updateChatMessage){
    let index = this.message.findIndex((d: chatDetail) => d.id === message.id)!;
    let isDernierElement = index === this.message.length - 1;
    if(isDernierElement) this.getDiscutionSimple(this.userId);
    this.message.splice(index,1)
    this.delete_msg_comfirme = false ; this.outside_delete_msg_comfirme = false
  }

  showEmoji() {
    if (!this.emoji_view) { this.emoji_view = true; setTimeout(() => { this.outside_box_emoji = true; }, 50); }
    else { this.emoji_view = false; this.outside_box_emoji = false; }
  }
  outsideBoxEmoji() {
    if (this.outside_box_emoji) {
      this.emoji_view = false;
      this.outside_box_emoji = false;
    }
  }

  clickEmoji(index: number) {
    this.send_text ? this.send_text += emoji[index] : this.send_text = emoji[index];
  }

  // Reaction
  target_reaction: number | null = null;
  on_reaction: boolean = false;
  on_emoji: boolean = false;
  on_msg: boolean = false;
  outside_reaction !: boolean;

  clickMsg(index: number) {
    this.on_msg = true;
    setTimeout(() => {
      console.log(this.on_reaction, this.target_reaction);
      if (!this.on_reaction && !this.on_emoji) {
        if (this.target_reaction == null) { this.target_reaction = index; this.outside_reaction = true; }
        else { this.target_reaction = null; this.outside_reaction = false; }
      }
    }, 50);
  }
  clickOnReaction() {
    this.on_reaction = true;
  }
  outsideReaction(index: number) {
    this.on_msg = false;
    setTimeout(() => {
      if (this.outside_reaction && !this.on_msg) {
        this.noReaction()
      }
    }, 50);
  }
  noReaction() {
    this.target_reaction = null;
    this.on_msg = false;
    this.on_reaction = false;
    this.outside_reaction = false;
    console.log('noReaction');

  }

  chooseReaction(message : updateChatMessage, index_mp: number, index_reaction: number) {
    this.on_emoji = true;
    this.message[index_mp].reaction = this.reactions[index_reaction];
    this.noReaction()
    setTimeout(() => {
      this.on_emoji = false;
    }, 100);
    message.reaction = this.reactions[index_reaction];
    this.updateMessage(message,1);
  }
  deleteReaction(message : updateChatMessage , index: number) {
    this.message[index].reaction = null;
    message.reaction = null;
    this.updateMessage(message,1);
  }

  sendMessage(data : chatMessage){
    
   
    this.chatService.addMessage(data).subscribe({
      next : (value) =>{
        console.log(value);
         this.signalRService.sendMessage(data.message,data.receiver,data.sender)
        this.getDiscution(this.userId , true);
        
        // this.message.push({
      //   id: '',
      //   position: 'droite',
      //   text: this.send_text,
      //   time: this.getHeureMadaNow(),
      // });
      // setTimeout(() => {
      //   this.scrollToBottom();
      // }, 100);
      // this.send_text = "";
      // console.log(this.message[this.message.length - 1]);
      },
      error: (err) =>{
        if(err.status == 200)this.getDiscution(this.userId , true);
        console.log(err);
      },
    });
  }

  send() {
    console.log(this.send_text);
    let value = this.send_text
    value == null || value == undefined ? value = "" : this.send_text;
   
    if(value !== null && value!.trim() !== "" ){
      let message : chatMessage = {
        connectionId :  this.signalRService.getConnectionId(),
        message :value,
        sender : this.userId,
        receiver :  this.discution_profil.contactId
      }
      this.sendMessage(message)
    }
  }

  getHeureMadaNow() {
    let date = new Date();
    let options = { timeZone: 'Indian/Antananarivo' };
    const dateString = date.toLocaleString('fr-FR', options);
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const isoDateString = `${year}-${month}-${day}T${timePart}`;

    return new Date(isoDateString);
  }

}
