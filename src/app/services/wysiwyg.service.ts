import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WysiWygService {

  constructor() { }

  modifyText(command: string, value: string = "") {
    document.execCommand(command, false, value);
  }

  onFontSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.modifyText('fontSize',  target.value);
  }

  changeFont(event: Event){
    const target = event.target as HTMLInputElement;
    this.modifyText('fontName',  target.value);
  }

  changeColor(event: Event){
    const target = event.target as HTMLInputElement;
    this.modifyText('foreColor',  target.value);
  }

  ajoutLink() {
    let userLink = prompt("Enter a URL");
    if (/http/i.test(userLink!)) {
      this.modifyText('createLink', userLink!);
    } else {
      userLink = "http://" + userLink;
      this.modifyText('createLink', userLink);
    }
  }

 
}
