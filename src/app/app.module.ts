import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { SearchComponent } from './component/search/search.component';
// import { RechercheComponent } from './dashboard/Recherche/recherche.component';
import { ConnexionComponent } from './authentification/connexion/connexion.component';
import { ConnexionEmailComponent } from './authentification/connexion/email/email.component';
import { RegisterComponent } from './authentification/register/register.component';
import { TunnelGiverComponent } from './authentification/register/giver/tunnel.component';
import { TunnelReceiverComponent } from './authentification/register/receiver/tunnel.component';
import { TunnelMixteComponent } from './authentification/register/mixte/tunnel.component';
import { UserComponent } from './dashboard/user/user.component';
import { CompteComponent } from './dashboard/user/compte/compte.component';
import { EditParticulierComponent } from './dashboard/user/edit/particulier/edit.component';
import { EditReceiverMixteComponent } from './dashboard/user/edit/information/edit.component';
import { HomeComponent } from './dashboard/user/home/home.component';
import { DmdComponent } from './component/demande/dmd.component';
import { SearchReiceiverComponent } from './component/search-receiver/search-receiver.component';
import { Profil3Component } from './dashboard/user/profil3/profil.component';
import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from './component/footer/footer.component';
import { AuthComponent } from './authentification/auth.component';
import { NavLogoComponent } from './component/nav-logo/nav.component';
import { ProfilViewComponent } from './dashboard/user/profil-view/profil.component';
import { AjoutEditComponent } from './dashboard/user/edit/contenu-ajout-edit/ajout-edit.component';
import { ActivitéComponent } from './dashboard/user/activitéDashbord/activité.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AccueilPrincipalComponent } from './accueil-principal/accueil.component';
import { NavPrincipalComponent } from './component/nav-accueil-principal/nav.component';
import { HomePrincipalComponent } from './accueil-principal/home/home.component';
import { ContacteComponent } from './accueil-principal/contacte/contacte.component';
import { SearchHomePrincipalComponent } from './accueil-principal/search/search.component';
import { RegisterEmailComponent } from './authentification/register/email/email.component';
import { LoadingComponent } from './component/loading/loading.component';
import { OtpVerificationComponent } from './authentification/register/otpVerification/otp.component';
import { FileSizePipe } from './pipes/fileSize.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { OtpComponent } from './component/otpVerification/otp.component';
import { RealisationComponent } from './dashboard/user/edit/realisation/realisation.component';
import { ActiviteDonateComponent } from './dashboard/user/activitéDashbord/donate/donate.component';
import { DonateComponent } from './dashboard/user/donate/donate.component';
import { DonateCreatComponent } from './dashboard/user/donate/creat/event.component';
import { NeedCreatComponent } from './dashboard/user/need/create/need.component';
import { ActiviteNeedComponent } from './dashboard/user/activitéDashbord/need/need.component';
import { ActiviteNeedViewComponent } from './dashboard/user/activitéDashbord/view-need/need.component';
import { ActiviteDonateViewComponent } from './dashboard/user/activitéDashbord/view-donate/donate.component';
import { SearchNeedComponent } from './component/search-need/search-need.component';
import { TimeAgoPipe } from './pipes/date-pipe/timeAgoPipe';
import { monthPipe } from './pipes/date-pipe/monthPipe';
import { dayPipe } from './pipes/date-pipe/dayPipe';
import { yearPipe } from './pipes/date-pipe/yearPipe';
import { DonateEditComponent } from './dashboard/user/donate/edit/event.component';
import { AdminComponent } from './Admin/admin.component';
import { AdminNavComponent } from './Admin/nav/nav.component';
import { AdminSearchComponent } from './Admin/search/search.component';
import { AdminDonateComponent } from './Admin/donate/donate/donate.component';
import { ForgotMdpComponent } from './accueil-principal/forgotMdp/forgot.component';
import { AdminMessageComponent } from './Admin/message/message.component';
import { GiverPreviewListeComponent } from './component/giver-preview/preview.component';
import { GiverSearchComponent } from './component/search-giver/giver.component';
import { ProfilViewGiverComponent } from './dashboard/user/profil-view-giver/profil.component';
import { ChatComponent } from './dashboard/user/chat/chat.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminSearchComponent,
    AdminNavComponent,
    AdminDonateComponent,
    AdminMessageComponent,

    // Simple user
    FileSizePipe,
    ClickOutsideDirective,
    NavPrincipalComponent,
    LoadingComponent,
    AppComponent,
    AccueilPrincipalComponent,
    SearchHomePrincipalComponent,
    NavComponent,
    HomePrincipalComponent,
    ContacteComponent,

    AuthComponent,
    OtpVerificationComponent,
    OtpComponent,
    ForgotMdpComponent,
    NavLogoComponent,

    ShellComponent,
    ConnexionComponent,
    ConnexionEmailComponent,
    RegisterComponent,
    RegisterEmailComponent,
    TunnelGiverComponent,
    TunnelReceiverComponent,
    TunnelMixteComponent,
    SearchComponent,
    // RechercheComponent,
    HomeComponent,
    UserComponent,
    Profil3Component,
    ProfilViewComponent,
    ProfilViewGiverComponent,
    CompteComponent,
    ActivitéComponent,
    EditParticulierComponent,
    EditReceiverMixteComponent,
    RealisationComponent,
    AjoutEditComponent,
    SearchReiceiverComponent,
    SearchNeedComponent,
    DmdComponent,
    // EventShowComponent,
    // EventCreatComponent,
    FooterComponent,

    ActiviteDonateComponent,
    ActiviteNeedComponent,
    ActiviteNeedViewComponent,
    ActiviteDonateViewComponent,

    DonateComponent,
    DonateCreatComponent,
    DonateEditComponent,
    NeedCreatComponent,

    GiverPreviewListeComponent,
    GiverSearchComponent,

    TimeAgoPipe,
    monthPipe,
    dayPipe,
    yearPipe,
    ChatComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    ImageCropperModule,
    Ng2ImgMaxModule,
  ],
  providers: [
      DatePipe,
      {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
