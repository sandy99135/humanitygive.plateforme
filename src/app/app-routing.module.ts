import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { ShellComponent } from './shell/shell.component';
// import { RechercheComponent } from './dashboard/Recherche/recherche.component';
import { ConnexionComponent } from './authentification/connexion/connexion.component';
import { ConnexionEmailComponent } from './authentification/connexion/email/email.component';
import { RegisterComponent } from './authentification/register/register.component';
import { RegisterEmailComponent } from './authentification/register/email/email.component';
import { RegisterTunnelComponent } from './authentification/register/tunnel/tunnel.component';
import { TunnelGiverComponent } from './authentification/register/giver/tunnel.component';
import { TunnelReceiverComponent } from './authentification/register/receiver/tunnel.component';
import { TunnelMixteComponent } from './authentification/register/mixte/tunnel.component';
import { UserComponent } from './dashboard/user/user.component';
import { CompteComponent } from './dashboard/user/compte/compte.component';
import { EditParticulierComponent } from './dashboard/user/edit/particulier/edit.component';
import { EditReceiverMixteComponent } from './dashboard/user/edit/information/edit.component';
import { HomeComponent } from './dashboard/user/home/home.component';
// import { EventCreatComponent } from './dashboard/event/creat/event.component';
// import { EventShowComponent } from './dashboard/event/show/event.component';
import { Profil3Component } from './dashboard/user/profil3/profil.component';
import { AuthComponent } from './authentification/auth.component';
import { ProfilViewComponent } from './dashboard/user/profil-view/profil.component';
import { AjoutEditComponent } from './dashboard/user/edit/contenu-ajout-edit/ajout-edit.component';
import { ActivitéComponent } from './dashboard/user/activitéDashbord/activité.component';
import { AccueilPrincipalComponent } from './accueil-principal/accueil.component';
import { HomePrincipalComponent } from './accueil-principal/home/home.component';
import { ContacteComponent } from './accueil-principal/contacte/contacte.component';
import { SearchReiceiverComponent } from './component/search-receiver/search-receiver.component';
import { SearchHomePrincipalComponent } from './accueil-principal/search/search.component';
import { OtpVerificationComponent } from './authentification/register/otpVerification/otp.component';
import { AuthGuard } from './guard/auth.guard';
import { RealisationComponent } from './dashboard/user/edit/realisation/realisation.component';
import { DonateComponent } from './dashboard/user/donate/donate.component';
import { DonateCreatComponent } from './dashboard/user/donate/creat/event.component';
import { NeedCreatComponent } from './dashboard/user/need/create/need.component';
import { ActiviteDonateComponent } from './dashboard/user/activitéDashbord/donate/donate.component';
import { ActiviteNeedComponent } from './dashboard/user/activitéDashbord/need/need.component';
import { ActiviteNeedViewComponent } from './dashboard/user/activitéDashbord/view-need/need.component';
import { ActiviteDonateViewComponent } from './dashboard/user/activitéDashbord/view-donate/donate.component';
import { SearchNeedComponent } from './component/search-need/search-need.component';
import { DonateEditComponent } from './dashboard/user/donate/edit/event.component';
import { AdminComponent } from './Admin/admin.component';
import { AdminSearchComponent } from './Admin/search/search.component';
import { AdminDonateComponent } from './Admin/donate/donate/donate.component';
import { ForgotMdpComponent } from './accueil-principal/forgotMdp/forgot.component';
import { AdminMessageComponent } from './Admin/message/message.component';
import { GiverSearchComponent } from './component/search-giver/giver.component';
import { ProfilViewGiverComponent } from './dashboard/user/profil-view-giver/profil.component';
import { ChatComponent } from './dashboard/user/chat/chat.component';

const routes: Routes = [
  
  {
    path: '',
    component: AccueilPrincipalComponent,
    children : [
      {
        path: 'home',
        component: HomePrincipalComponent,
      },
      {
        path: 'contacte',
        component: ContacteComponent,
      },
      {
        path: 'apropos',
        component: AccueilPrincipalComponent,
      },
      {
        path: 'recherche',
        component: SearchHomePrincipalComponent,
      },
      {
        path: 'forgotMdp',
        component: ForgotMdpComponent,
      },
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children : [
      {
        path: 'login',
        component: ConnexionComponent,
      },
      {
        path: 'login/email',
        component: ConnexionEmailComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'register/email',
        component: RegisterEmailComponent,
      },
      {
        path: 'register/tunnel',
        component: RegisterTunnelComponent,
      },
      {
        path: 'register/tunnel/giver',
        component: TunnelGiverComponent,
      },
      {
        path: 'register/tunnel/receiver',
        component: TunnelReceiverComponent,
      },
      {
        path: 'register/tunnel/mixte',
        component: TunnelMixteComponent,
      },
      {
        path: 'otp',
        component: OtpVerificationComponent,
      },
    ]
  },

  {
    path: 'niveau/admin',
    component: AdminComponent,
    // canActivate:[AuthGuard],
    children : [
      {
        path: 'utilisateur',
        component: AdminSearchComponent,
        children : [
          {
            path: 'search',
            component: AdminSearchComponent,
          },
          {
            path: 'profil-view',
            component: ProfilViewComponent ,
          },
        ]
      },
      {
        path: 'donate',
        children : [
          {
            path: 'list',
            component: AdminDonateComponent,
          },
          {
            path: 'view',
            component: ActiviteDonateViewComponent ,
          },
        ]
      },
      {
        path: 'message',
        children : [
          {
            path: 'globale',
            component: AdminMessageComponent,
          }
        ]
      },
      
    ]
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'user',
        component: UserComponent,
        canActivate:[AuthGuard],
        children: [
          {
            path: 'home',
            children : [
              {
                path: 'association',
                component: SearchReiceiverComponent,
              },
              {
                path: 'giver',
                component: GiverSearchComponent,
              },
              {
                path: 'besoin',
                component: SearchNeedComponent,
              },
            ]
          },
          {
            path: 'recherche',
            component: SearchReiceiverComponent,
          },
          {
            path: 'profile',
            component: Profil3Component,
          },
          {
            path: 'profil-view',
            component: ProfilViewComponent,
          },
          {
            path: 'profil-view-giver',
            component: ProfilViewGiverComponent,
          },
          {
            path: 'compte',
            component: CompteComponent,
          },
          {
            path: 'edit/particulier',
            component: EditParticulierComponent,
          },
          {
            path: 'edit/receiver&mixte',
            component: EditReceiverMixteComponent,
          },
          {
            path: 'edit/receiver&mixte&ajout&edit',
            component: AjoutEditComponent,
          },
          {
            path: 'edit/realisations',
            component: RealisationComponent,
          }
          ,
          {
            path: 'donate',
            component: DonateComponent,
          }
          ,
          {
            path: 'donate/create',
            component: DonateCreatComponent,
          }
          ,
          {
            path: 'donate/edit',
            component: DonateEditComponent,
          }
          ,
         {
          path: 'need/create',
          component: NeedCreatComponent,
         },
        {
          path: 'activite',
          component: ActivitéComponent,
          children: [
            {
              path: 'donate',
              component: ActiviteDonateComponent,
            },
            {
              path: 'need',
              component: ActiviteNeedComponent,
            }
          ]
        },
        {
          path: 'need/view',
          component: ActiviteNeedViewComponent,
        }
        ,
        {
          path: 'donate/view',
          component: ActiviteDonateViewComponent,
        },
        {
          path: 'chat',
          component: ChatComponent,
        },

        ]
      }, 
      // {
      //   path: 'event/show&public',
      //   component: EventShowComponent,
      //   canActivate:[AuthGuard],
      // },
      // {
      //   path: 'event/create',
      //   component: EventCreatComponent,
      //   canActivate:[AuthGuard],
      // },
      
    ],
  },


  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

const config : ExtraOptions = {
  useHash : true,
}
@NgModule({
  imports: [RouterModule.forRoot(routes , config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
