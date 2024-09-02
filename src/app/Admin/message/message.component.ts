import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { ContacteService } from 'src/app/services/contacte.service';

@Component({
    selector: 'app-admin-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
})
export class AdminMessageComponent implements OnInit {

    data !: any[];
    dataR !: any[];
    menu_active: number = 1;
    nb: any = {
        all: 0,
        inconnue: 0,
        utilisateur: 0,
    }
    loading: boolean = false;

    constructor(
        private router: Router,
        private location: Location,
        private contactService: ContacteService
    ) { }

    ngOnInit(): void {
        this.getMsg();
    }

    getMsg() {
        this.loading = true;
        this.contactService.getMessage().subscribe((response: any) => {
            this.data = response.data;
            this.dataR = response.data;
            this.nb.all = response.total;
            this.dashbordAffichage()
            this.loading = false;
            console.log(response.data);
        });
    }

    dashbordAffichage() {
        let text = "From Amelioration Plateform"
        this.nb.inconnue = this.data.filter(msg => !msg.message.includes(text)).length;
        this.nb.utilisateur = this.data.filter(msg => msg.message.includes(text)).length;
    }

    menu(target: number) {
        this.menu_active = target;
        this.data = this.dataR ;
        let text = "From Amelioration Plateform"
        target == 1 ? this.data = this.dataR :
        target == 2 ?  this.data = this.data.filter(msg => !msg.message.includes(text)) : this.data = this.data.filter(msg => msg.message.includes(text)) ;
    }
}
