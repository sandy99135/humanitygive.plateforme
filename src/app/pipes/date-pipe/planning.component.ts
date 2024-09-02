import { Component, OnInit } from '@angular/core';
import { CollaborateurService } from 'src/app/services/collaborateur.service';
import { OrganigrammeService } from 'src/app/services/organigramme.service';
import { Data, rh } from './data';
import { DateService } from 'src/app/services/date.service';
import { ReservationFrontModel, ReservationModel, TransportModel } from 'src/app/models/transports/ReservationModel';
import { AxeQuartierModel } from 'src/app/models/transports/AxeQuartierModel';
import { BehaviorSubject } from 'rxjs';
import { log } from 'console';
import { Router } from '@angular/router';
import { InscriptionModel } from 'src/app/models/transports/InscriptionModel';
import { QuartierModel } from 'src/app/models/transports/QuartierModel';
import { AxeModel } from 'src/app/models/transports/AxeModel ';
import { TransportService } from '../services/transport.service';
import { ListeReservationService } from '../services/listeReservation.service';
import { Absence } from 'src/app/models/absence';
import { SortieCollab } from 'src/app/models/sortie-collab';
import { ShiftModel } from 'src/app/models/transports/ShiftModel';
import { CollabModel } from 'src/app/models/transports/CollabModel';
import { Collaborateur } from 'src/app/models/collaborateur';

@Component({
    selector: 'app-transport-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.scss']
})
export class TransportPlanningComponent implements OnInit {

    week_number !: number;
    year !: number;
    matricule!: string;
    demissionaire ! : SortieCollab | null;
    debut !: Date;
    fin !: Date;
    // current_date !: Date;
    absence : any[] = [];

    jours: any[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    tData!: TransportModel;
    tDataR!: TransportModel;
    planning !: any[];
    user_matricule!: string;
    demandeur_departementID!: number;
    departementID!: number;
    user_poste!: string;
    user_role!: string;
    isAdminSirh: boolean = false;
    AdminSirh : any[] = rh ;
    isPlanificateur : boolean = false;
    isInformaticien : boolean = false;

    selectedDate !: Date;
    Debut !: string;
    Fin !: string;

    lastWeek: boolean = false;
    lastReservation : boolean = false;
    dateLimite: boolean = false;

    insription !: InscriptionModel;
    isInscrit: boolean = false;
    chooseShift: boolean = false;
    organigramme !: any;
    shift !: ShiftModel[];
    quartier !: any;
    axe !: any;
    axeQuartier!: any[];

    send_active: boolean = false;
    send_loading: boolean = false;
    succes: boolean = false;
    error_message!: string | null;
    screen !: number;

    loading_init: boolean = true;
    loading: boolean = true;
    loading_shift:boolean = false;
    loading_axe: boolean = false;
    loading_axeQuartier: boolean = false;
    loading_quartier: boolean = false;
    loading_departement: boolean = false;
    loading_planning: boolean = false;
    loading_inscriptionListe: boolean = false;

    ListeReservation !: any[];
    ListeDays !: any[];
    inscriptionListe !: InscriptionModel[];
    autocomplete_matricule: InscriptionModel[] = [];

    // current_jeudi !: Date ;
    heureMadagascar !: number ;
    coachFormationDepartement : number = 77 ;

    constructor(
        private router: Router,
        private CService: CollaborateurService,
        private oService: OrganigrammeService,
        private tService: TransportService,
        private dService: DateService,
        private lReservation: ListeReservationService
    ) {
        this.tData = Data;
    }

    async ngOnInit(): Promise<void> {
        this.user_matricule = localStorage.getItem('matricule')!;
        this.matricule = localStorage.getItem('matricule')!;
        this.user_role = localStorage.getItem('role')!;
        this.user_poste = localStorage.getItem('poste')!;
        this.week_number = this.dService.getWeek(new Date());
        this.year = new Date().getFullYear();
        this.screen = window.innerWidth;
        this.CService.GetCollaborateurById(this.user_matricule).subscribe((data : Collaborateur) => {
            console.log('user' , data);
            this.isPlanificateur = data.poste == 'PLANIFICATEUR' ? true : false ;
            !this.isAdminSirh ?
                this.isAdminSirh = this.AdminSirh.includes(data.matricule) ? true : false
            : this.isAdminSirh = true;
            if(this.isAdminSirh){
                this.initData()
                this.gestionDemission()
            }
            else{
                this.verifInscription();
                this.ifJeudi17hLimite();
            }

            if(data.poste.includes("RESPONSABLE INFORMATIQUE") || data.poste.includes("TECHNICIEN INFORMATIQUE")){
              this.isInformaticien = true;
            }
        });

        let date = new Date();
        let options = { timeZone: 'Indian/Antananarivo' };
        let dateMadagascar = date.toLocaleString('fr-FR', options); 
        let heureString = dateMadagascar.split(" ")[1]; 
        this.heureMadagascar = parseInt(heureString.split(":")[0]) ;
        
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    verifInscription() {
        this.loading = true;
        this.tService.getInscription(this.user_matricule).subscribe({
            next: (data: InscriptionModel) => {
                this.isInscrit = true;
                this.insription = data;
                this.initData()
            },
            error: (err) => {
                if(!this.AdminSirh.includes(this.matricule)){
                    this.router.navigate(['inscription-transport']);
                }
            }
        }
        );
    }

    initData(){
        // this.isInscrit = true;
        // this.insription = data;
        this.getDepartement(this.matricule);
        this.getShift();
        this.getQuartier();
        this.getAxe();
        this.getAllAxeQuartier();
        if(!this.isPlanificateur) this.getAllInscription();
    }

    loadingDataControle() {
        if (this.loading_shift && this.loading_axe && this.loading_quartier && this.loading_axeQuartier && this.loading_departement && this.loading_inscriptionListe) {
            this.params(this.dService.getDateNextWeek(new Date()));
        }
    }

    params(date: Date, is_last_week: boolean = false) {
        this.isDateLimite(date);
        this.getLastWeekReservation(date);
        this.loading = true;
        this.error_message = null;
        this.succes = false;
        const debut = this.dService.getOneDayOfWeek(date, 1);
        const fin = this.dService.getOneDayOfWeek(date, 5);
        this.debut = debut;
        this.fin = fin;
        if (!is_last_week) {
            this.selectedDate = date;
            this.year = date.getFullYear();
            this.week_number = this.dService.getWeekNumber(date);
            this.Debut = this.dService.format(debut, "JMA");
            this.Fin = this.dService.format(fin, "JMA");
            this.getAbsence(this.matricule, this.dService.format(debut), this.dService.format(fin));
            this.getListeReservation(debut, fin);
        }
        this.getReservation(debut, fin, this.matricule, is_last_week);
    }

    getReservation(debut: Date, fin: Date, matricule: string, is_last_week: boolean = false , fromInterval : boolean = false) {
        let dt = this.dService.format(debut);
        let df = this.dService.format(fin);
        this.tService.getReservation(dt, df, matricule).subscribe((data: ReservationFrontModel[]) => {
            if(!fromInterval) this.error_message = null;
            // this.planning = data;
            if (data.length === 0) {
                this.isAdminSirh ?
                    !is_last_week ?
                        this.error_message = "Semaine " + this.week_number + " : Aucune réservation pour l'agent " + this.matricule
                        : this.error_message = "Semaine " + (this.week_number - 1) + " : Aucune réservation pour l'agent " + this.matricule
                    : null;
                this.loading = false;
                this.send_active = false;
                this.lastWeek = true
            }
            if (this.dService.getWeek(debut) < this.dService.getWeek(new Date)) this.lastWeek = false;
            this.dataTraitement(data, debut, fin, is_last_week);
        });
    }

    gestionDemission(){
        this.tService.gestionDemission().subscribe({
            next: (data: any) => {
                console.log("Gestion Demission , Suppression des reservations apres le dernier jour ");
            }
        }
        );
    }

    changeSelectedDate(event: any) {
        const selected = new Date(event.target.value);
        this.params(selected);
    }

    searchByMatricule(matricule: string) {
        if (matricule.length < 5) {
            this.error_message = matricule + " : Veuillez fournir un numéro de matricule correct.";
            return
        }
        if (this.AdminSirh.includes(this.matricule)) {
            this.error_message = matricule + " : RH Matricule"
            this.tService.resetData(this.tData, this.insription, this.chooseShift);
        }
        else{
            this.loading = true;
            this.error_message = null;
            this.CService.GetCollaborateurById(matricule.toString()).subscribe({
                next:(data : any) => {
                    console.log();
                        let dep_dc = this.organigramme[0].children.find((dep: any) => dep.name === "DIRECTEUR DU DEVELOPPEMENT COMMERCIAL");
                        let isCommercial = this.tService.isDepartementChild(dep_dc, data.departementID);
                        if(this.isPlanificateur && !isCommercial){
                            this.tService.resetData(this.tData, this.insription, this.chooseShift);
                            this.error_message = matricule + " : Agent non commercial";
                            this.loading = false;
                        }
                        else{
                            this.searchByMatriculeParams(matricule)
                        }
                },
                error :(err : any) => {this.searchByMatriculeParams(matricule)}
            } );
        }
    }

    searchByMatriculeParams(matricule: string){
        this.tService.getInscription(matricule).subscribe({
            next: (data: InscriptionModel) => {
                console.log(data);
                this.isInscrit = true;
                this.insription = data;
                // this.tService.resetData(this.tData, this.insription, this.chooseShift);
                this.getDepartement(this.matricule);
                this.params(this.selectedDate);
            },
            error: (err) => {
                    this.error_message = "L'agent " + matricule + " n'est pas inscrit dans le planning transport";
                    this.CService.GetCollaborateurById(matricule.toString()).subscribe(
                        (data) => {
                            localStorage.setItem('matriculeInputdata', matricule);
                            this.router.navigate(['inscription-transport']);
                        },
                        err => {
                            this.isInscrit = false;
                            this.send_active = false;
                            this.loading = false;
                            this.lastWeek = false;
                            this.error_message = "Matricule " + matricule + " : n'existe pas";
                        },
                    );
            }
        }
        );
    }

    getlastWeekData() {
        const select = new Date(this.dService.format(this.selectedDate));
        let date = this.dService.getDateLastWeek(select);
        this.params(date, true);
    }

    getAbsence(matricule: string, debut: string, fin: string) {
        let daysArray: any[] = this.dService.getDaysArray(new Date(debut), new Date(fin)).map(d => { return { day: this.dService.format(d), bus: true } });
        let tabAbs: any = [];
        this.tService.getAbsence(matricule, debut, fin).subscribe({
            next: (reponse: Absence[]) => {
                console.log(reponse);
                this.absence = reponse ;
            },
            error: (err) => { console.log(err); }
        })
    }

    isAbsenceDay(day : Date , trajet : string){
        let reponse : Boolean[] = []
        this.absence!.map((f:any) => {
            trajet == "R"?
            this.dService.format(new Date(f.day)) === this.dService.format(new Date(day)) && f.busAM == false ? reponse.push(false) : null
            :this.dService.format(new Date(f.day)) === this.dService.format(new Date(day)) && f.busPM == false ? reponse.push(false) : null
        });
        return reponse.includes(false);
    }

    isDemissionaireDay(day : Date ){
        if(this.demissionaire){
            let demission = new Date(this.demissionaire.dernierJour)
            return new Date(day)  >= new Date(demission.setDate(demission.getDate() + 1))
        }
        return
    }
    
    agentDateLimite(day : Date ) : any{
        
        let vendredi_current_week = this.dService.getOneDayOfWeek (new Date() , 5);
        let jeudi_current_week = this.dService.getOneDayOfWeek (new Date() , 4);
        let jeudi = new Date(this.dService.format(jeudi_current_week));
        let samedi_next = this.dService.getOneDayOfWeek (new Date(jeudi.setDate(jeudi.getDate() + 7)) , 6);

        let date = new Date();
        let options = { timeZone: 'Indian/Antananarivo' };
        let dateMadagascar = date.toLocaleString('fr-FR', options); 
        let heureString = dateMadagascar.split(" ")[1]; 
        let heureMadagascar = parseInt(heureString.split(":")[0]) ;

        if(!this.AdminSirh.includes(this.user_matricule) && !this.isPlanificateur){
            if(new Date().getDate() > jeudi_current_week.getDate() ||(this.dService.format(jeudi_current_week) ==  this.dService.format(new Date()) && heureMadagascar >= 17)){
                if(new Date(day) < samedi_next ){ return true }
            }
            // else{
            //     if(new Date(day) < vendredi_current_week){  console.log(day , true) ; return true }
            // }
        }
        // return false
    }

    isDateLimite(date : Date){
        let jeudi_week = this.dService.getOneDayOfWeek (date , 4);
        let vend_week = this.dService.getOneDayOfWeek (date , 5);
        let j = new Date(this.dService.format(jeudi_week));
        let jeudi_last = this.dService.getOneDayOfWeek (new Date(j.setDate(j.getDate() - 7)) , 4);
        if(!this.AdminSirh.includes(this.user_matricule)){
            console.log(new Date() , jeudi_last);
            new Date() > jeudi_last ? this.dateLimite = true : this.dateLimite = false ;
        }
        else {
            new Date() >  vend_week ? this.dateLimite = true : this.dateLimite = false ;
        }
    }

    getLastWeekReservation(date : Date){
        let d = new Date(this.dService.format(date)) ;
        let D = new Date(d.setDate(d.getDate() - 7))
        const dt = this.dService.format(this.dService.getOneDayOfWeek(D, 1));
        const df = this.dService.format(this.dService.getOneDayOfWeek(D, 5));
        this.tService.getReservation(dt, df, this.matricule).subscribe((data: ReservationFrontModel[]) => {
            data  && data.length !== 0 ? this.lastReservation = true : this.lastReservation = false;
        });
    }

    getDepartement(matricule: string) {
        this.CService.GetCollaborateurById(matricule.toString()).subscribe((data) => {
            this.departementID = data.departementID;
            this.demandeur_departementID = data.departementID;
            !this.organigramme || this.organigramme.length == 0 ? this.getOrganigramme() : this.isChooseShift(this.organigramme, this.departementID);

            data.etat == 9 ?  this.getSortiCollab(matricule) : this.demissionaire = null ;
        });
    }
    getSortiCollab(matricule : string) {
        this.tService.getSortiCollab(matricule).subscribe((data) => {
            this.demissionaire = data;
        });
    }

    getOrganigramme() {
        this.oService.GetOrganigramme().subscribe((data) => {
            this.organigramme = data;
            this.isChooseShift(data, this.departementID);
            this.loading_departement = true;
            this.loadingDataControle();
            if(this.isPlanificateur) this.getPlanificateurInscription()
        });
    }

    isChooseShift(organigramme: any, departementID: number) {
        let dep_dc = organigramme[0].children.find((dep: any) => dep.name === "DIRECTEUR DU DEVELOPPEMENT COMMERCIAL");
        let dep_Info = organigramme[0].children[4].children[1];
        let isCommercial = this.tService.isDepartementChild(dep_dc, departementID)
        let isInformatique = this.tService.isDepartementChild(dep_Info, departementID)
        
        if (isCommercial || isInformatique || this.departementID == this.coachFormationDepartement) {
            this.chooseShift = true
        }
        else {
            this.chooseShift = false;
            this.tData.ramassage.forEach(planning => {
                planning.shiftId = 1;
            });
            this.tData.livraison.forEach(planning => {
                planning.shiftId = 1;
            });
        }
    }

    getAllInscription() {
        this.tService.getAllInscription().subscribe((incription) => {
                this.inscriptionListe = incription;
                this.loading_inscriptionListe = true;
                this.loadingDataControle();
        });
    }

    getPlanificateurInscription() {
        this.tService.getAllInscription().subscribe((incription) => {
                this.tService.getCollaborateurInscrit().subscribe((collabs:any) => {
                    let dep_dc = this.organigramme[0].children.find((dep: any) => dep.name === "DIRECTEUR DU DEVELOPPEMENT COMMERCIAL");
                    collabs.forEach((col:any) => {
                        col.isCommercial = this.tService.isDepartementChild(dep_dc, col.departementID)
                    });
                    this.inscriptionListe = incription.filter(ins => {
                        const correspondingItem = collabs.find((col:any) => col.matricule === ins.matricule);
                        return correspondingItem && correspondingItem.isCommercial === true;
                    });
                    console.log('inscriptionListe' , this.inscriptionListe);
                    this.loading_inscriptionListe = true;
                    this.loadingDataControle();
                })
        });
    }

    getShift() {
        this.tService.getShift().subscribe((data) => {
            this.shift = data;
            this.loading_shift = true;
            this.loadingDataControle();
        });
    }

    getQuartier() {
        this.tService.getQuartier().subscribe((data) => {
            this.quartier = data;
            this.loading_quartier = true;
            this.loadingDataControle();
        });
    }

    getAxe() {
        this.tService.getAxe().subscribe((data) => {
            this.axe = data;
            this.loading_axe = true;
            this.loadingDataControle();
        });
    }

    getAllAxeQuartier() {
        this.tService.getAllAxeQuartier().subscribe((data) => {
            console.log("AxeQuartier", data);
            this.axeQuartier = data;
            this.loading_axeQuartier = true;
            this.loadingDataControle();
        });
    }

    getAxeQuartier(isRamassage : boolean , fokotany: string | undefined, index: number , shiftId : number  = 1) {
        let targetData : ReservationFrontModel[] = isRamassage ? this.tData.ramassage : this.tData.livraison;
        let result: AxeQuartierModel[] = this.axeQuartier.filter(q => q.passerSurFokontany == fokotany && q.shiftId == shiftId);
        if (result.length !== 0) {
            targetData[index].axe_tab = result;
            targetData[index].axeId = result[0].numAxe;
            targetData[index].axe = result[0].nomAxe;
        }
        else {
            targetData[index].axe_tab = [];
            targetData[index].axeId = 0;
            targetData[index].axe = "Axe";
        }
    }

    selectShift(isRamassage : boolean , planning : ReservationModel , index : number){
        console.log( planning , index);
        this.getAxeQuartier(isRamassage , planning.quartier, index , planning.shiftId)
    }

    changeActive( isRamassage : boolean ,index: number, jour: Date) {
        console.log(isRamassage , index);
        let targetData : ReservationFrontModel[] = isRamassage ? this.tData.ramassage : this.tData.livraison;
        if(!this.currentDateCompare(jour) || this.isAbsenceDay(jour ,  isRamassage ? 'R' : 'L' ) || this.isDemissionaireDay(jour) , this.agentDateLimite(jour)){

        }
        else
        {
            
            
            if (this.isInscrit) {
                targetData[index].etat == 1 ? targetData[index].etat = 0 : targetData[index].etat = 1;
                let tab: any[] = [];
                this.tData.ramassage.forEach(planning => {
                    planning.etat == 1 ? tab.push(true) : tab.push(false);
                });
                this.tData.livraison.forEach(planning => {
                    planning.etat == 1 ? tab.push(true) : tab.push(false);
                });
                tab.includes(true) ? this.send_active = true : this.send_active = false;
            }
        }
        
    }

    currentDateCompare(a: Date, from: string = "") {
        return new Date(a) >= (new Date());
    }

    // *** Autocomplete ***

    select(isRamassage : boolean , data: any, index: number) {
        let targetData : ReservationFrontModel[] = isRamassage ? this.tData.ramassage : this.tData.livraison;
        targetData[index].quartierId = data.quartierId;
        targetData[index].quartier = data.fokontany;
        this.getAxeQuartier( isRamassage , data.fokontany, index , targetData[index].shiftId);
    }

    autocompleteQuartier(isRamassage : boolean , index: number) {
        let targetData : ReservationFrontModel[] = isRamassage ? this.tData.ramassage : this.tData.livraison;
        targetData[index].autocomplete_quartier = this.quartier;
        if (targetData[index].quartier!.length == 0) {
            targetData[index].autocomplete_quartier = [];
        }
        else {
            targetData[index].autocomplete_quartier = this.quartier;
            let dt = targetData[index].quartier;
            targetData[index].autocomplete_quartier = (targetData[index].autocomplete_quartier!).filter(
                function (data: any) {
                    return data.fokontany.toUpperCase().includes('' + dt!.toUpperCase() + '');
                });
        }
    }

    stopAutocomplement(isRamassage : boolean , index: number) {
        let targetData : ReservationFrontModel[] = isRamassage ? this.tData.ramassage : this.tData.livraison;
        if (targetData[index].quartier == "") {
            targetData[index].quartierId = 0;
            targetData[index].axe_tab = [];
        }
        else {
            let dt = targetData[index].quartier;
            let quartier = this.quartier.find((q: any) => q.fokontany.toUpperCase() == dt!.toUpperCase());
            if (quartier != null) {
                targetData[index].quartierId = quartier.quartierId;
                targetData[index].quartier = quartier.fokontany;
                this.getAxeQuartier(isRamassage , targetData[index].quartier, index);
            }
        }
        let close = () => { targetData[index].autocomplete_quartier = [] };
        setTimeout(close, 200);
    }

    dataTraitement(data: ReservationFrontModel[], debut: Date, fin: Date, is_last_week: boolean = false) {

        !is_last_week ? this.tService.resetData(this.tData, this.insription, this.chooseShift) : null;
         let days: any[] = this.dService.getDaysArray(debut, fin).map(d => this.dService.format(d));
        // Renitialiser par rapport au donnée d'inscription
        // Gerer planificateur et RH controle formulaire
        if(!this.AdminSirh.includes(this.matricule) || (this.isPlanificateur && this.chooseShift)){
            let tab = [this.tData.ramassage, this.tData.livraison];
            tab.forEach((targetData: any) => {
                targetData.forEach((item: any, i : number) => {
                    this.inscriptionTraitement( targetData , i, is_last_week);
                });
            });
        }

        if (data.length !== 0) {
            let tabRAdd : any[] = []
            data.forEach((element: any, index) => {
                let targetData : ReservationFrontModel[] = element.reservationType == "R" ? this.tData.ramassage : this.tData.livraison;
                let fokotany = this.quartier.find((q: any) => q.quartierId == element.quartierId).fokontany
                let reservation: ReservationFrontModel = {
                    reservationId: is_last_week ? null : element.reservationId,
                    reservationType : element.reservationType,
                    collabId: element.collabId,
                    jour: is_last_week ? null : element.jour,
                    year: 0,
                    demandeurMatricule: element.demandeurMatricule,
                    semaine: is_last_week ? null : element.semaine,
                    shiftId: element.shiftId,
                    axeId: element.axeId,
                    quartierId: element.quartierId,
                    quartier: fokotany,
                    autocomplete_quartier: [],
                    axe: element.axe.nom,
                    axe_tab: [],
                    etat: this.currentDateCompare(element.jour, "Traitement") ? element.etat : -1,
                    // etat: this.currentDateCompare(element.jour, "Traitement") ? element.etat : -1,
                }
                days.forEach((item, i) => {
                    this.send_active = true;
                    if (item == this.dService.format(new Date(element.jour))) {
                        if(is_last_week){
                            reservation.reservationId = targetData[i].reservationId;
                            reservation.jour = targetData[i].jour;
                            reservation.semaine = targetData[i].semaine;
                        }
                        targetData[i] = reservation;
                        this.AxeQuartierTraitement( targetData , fokotany, i ,reservation.shiftId);
                    }
                });
            });
        }
        this.loading = false;
        this.loading_init = false;

        console.log('Traitement',this.tData);
    }

    inscriptionTraitement( targetData: ReservationFrontModel[] , i: number, is_last_week: boolean) {
        let days: any[] = this.dService.getDaysArray(this.debut, this.fin);
        !is_last_week ? targetData[i].jour = days[i] : null;

        // Prendre donnée d'inscription
        let fk: any = this.quartier.find((q: QuartierModel) => q.quartierId == this.insription.quartier);
        targetData[i].quartierId = fk.quartierId;
        targetData[i].quartier = fk.fokontany;
        this.AxeQuartierTraitement(targetData , fk.fokontany, i , targetData[i].shiftId);
        targetData[i].shiftId = this.insription.shift;
        targetData[i].axeId = this.insription.axe;
        targetData[i].axe = this.axe.find((a: any) => a.id == this.insription.axe).nom;
    }

    AxeQuartierTraitement( targetData : ReservationFrontModel[], fokotany: string | undefined, iData: number , shiftId : number) {
        let result: AxeQuartierModel[] = this.axeQuartier.filter(q => q.passerSurFokontany == fokotany && q.shiftId == shiftId);

        if (result.length !== 0) {
            // mettre l'axe choisir par defaut en premier lieu
            let indexToMove = result.findIndex(obj => obj.nomAxe === targetData[iData].axe);
            if (indexToMove !== -1) {
                let movedObject = result.splice(indexToMove, 1)[0];
                result.unshift(movedObject);
            }
            if (targetData[iData].axe_tab != result) {
                targetData[iData].axe_tab = result;
            }
        }
    }

    // Add and update ***

    validation() {
        this.error_message = null;
        this.succes = false;
        let tab = {
            quartier: [true], shift: [true], axe: [true]
        }
        let data = [this.tData.ramassage , this.tData.livraison];
        data.forEach(res => {
            res.forEach(planning => {
                if (planning.etat == 1) {
                    planning.quartierId === 0 ? tab.quartier.push(false) : null;
                    planning.shiftId === 0 ? tab.shift.push(false) : null;
                    planning.axeId == 0 ? tab.axe.push(false) : null;
                }
            });
        });
        tab.quartier.includes(false) ? this.error_message = "Quartier incomplet" : null;
        tab.shift.includes(false) ? this.error_message = "Shift incomplet" : null;
        tab.axe.includes(false) ? this.error_message = "Axe incomplet" : null;
    }

    enregistrer() {
        this.validation()
        let reservation: ReservationModel[] = [];
        let reservationFusionne = [...this.tData.ramassage, ...this.tData.livraison];
        console.log(reservationFusionne);

        reservationFusionne.forEach((planning, index: number) => {
            let data: ReservationModel = {
                reservationId: planning.reservationId,
                reservationType : planning.reservationType,
                jour: planning.jour,
                semaine: this.week_number,
                year: this.selectedDate.getFullYear(),
                collabId: this.matricule,
                demandeurMatricule: this.user_matricule,
                etat: planning.etat,
                quartierId: planning.quartierId,
                shiftId: planning.shiftId,
                axeId: planning.axeId,
            }
            console.log(data);
            planning.etat == 1 || (planning.etat == 0 && planning.reservationId != 0) ? reservation.push(data) : null;
        });

        if (this.error_message == null) {
            this.send_loading = true;
            this.tService.addReservation(reservation).subscribe(
                (response) => {
                    this.send_loading = false;
                    this.params(this.selectedDate);
                    this.succes = true;
                    // this.getListeReservation(this.debut, this.fin);
                },
                (err) => {
                    console.log(err);
                    this.error_message = "Erreur du serveur"
                    this.send_loading = false;
                }
            );
        }
    }

    // *** Autocomplete matricule ***

    selectMatricule(event: any) {
        console.log(event.matricule);
        this.matricule = event.matricule;
        this.searchByMatricule(event.matricule);
        this.autocomplete_matricule = [];
    }

    stopAutocomplementMatricule() {
        let close = () => { this.autocomplete_matricule = [] };
        setTimeout(close, 200);
    }

    autocompleteMatricule(event: any) {
        this.autocomplete_matricule = this.inscriptionListe;

        let dt = event.target.value;
        this.autocomplete_matricule = this.autocomplete_matricule.filter(
            function (data: any) {
                return data.matricule.toUpperCase().includes('' + dt!.toUpperCase() + '');
            });
    }


    // *** Liste Reservation ***

    loading_liste: boolean = true;

    getListeReservation(debut: Date, fin: Date) {
        let d = this.dService.format(debut);
        let f = this.dService.format(fin);
        if (this.isAdminSirh) {
            this.loading_liste = true;
            this.lReservation.getAllReservation(d, f).subscribe(
                (data: any) => {
                    this.listeTraitement(debut, fin, data);
                }
            )
        }
    }

    listeTraitement(debut: Date, fin: Date, data: any) {
        let days: any[] = this.dService.getDaysArray(debut, fin).map(d => this.dService.format(d));
        this.ListeDays = this.dService.getDaysArray(debut, fin).map(d => this.dService.format(d, "JMA", true));

        data.forEach((agent: any, i: number) => {
            let newAgent: any = {
                ramassage : [null, null, null, null, null],
                livraison : [null, null, null, null, null],
            }
            agent.forEach((reservation: any, r: number) => {
                days.forEach((day, d) => {
                    if (day == this.dService.format(new Date(reservation.jour)) &&  reservation.reservationType == "R") {
                        newAgent.ramassage[d] = reservation;
                    }
                    if (day == this.dService.format(new Date(reservation.jour)) &&  reservation.reservationType == "L") {
                        newAgent.livraison[d] = reservation;
                    }
                });
                let addnew = {
                    matricule: reservation.matricule,
                    nom: reservation.nom,
                    prenom: reservation.prenom,
                    poste: reservation.poste,
                    data: newAgent,
                }
                data[i] = addnew;
            });
        });
        this.ListeReservation = data;
        this.loading_liste = false;
    }

    // Gestion date limite task
    interval: any;
    ifJeudi17hLimite(): void {
        const now = new Date();
        if(now.getDay() === 4){
            this.interval = setInterval(() => {
                let date = new Date();
                let options = { timeZone: 'Indian/Antananarivo' };
                let dateMadagascar = date.toLocaleString('fr-FR', options); 
                let heureString = dateMadagascar.split(" ")[1]; 
                let heureMadagascar = parseInt(heureString.split(":")[0]) 

                if (heureMadagascar >= 17) { 
                    this.getReservation(this.debut, this.fin, this.matricule , false , true);
                    this.error_message = "Reservation clôturée pour la semaine du : Lundi " + this.Debut + ' au Vendredi ' + this.Fin;
                    console.log("Reservation clôturée pour la semaine du : Lundi " + this.Debut + ' au Vendredi ' + this.Fin);
                    clearInterval(this.interval);
                  }
              }, 60000); 
        }
      }
    
}
