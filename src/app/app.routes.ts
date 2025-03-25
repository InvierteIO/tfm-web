import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import {
  RegisterPersonalInfoComponent
} from './features/auth/sign-up/register-personal-info/register-personal-info.component';
import {
  AccountConfigurationComponent
} from './features/auth/sign-up/account-configuration/account-configuration.component';
import {AccountActivationComponent} from './features/auth/sign-up/account-activation/account-activation.component';

export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'auth/login',
    },
    {
        path : 'home', component: HomeComponent
    },
    {
        path: 'auth',
        children : [
          {
            path: 'login', component: LoginComponent
          },
          {
            path: 'signup',
            children : [
              {
                path: 'register-info', component: RegisterPersonalInfoComponent
              },
              {
                path: 'account-configuration', component: AccountConfigurationComponent
              },
              {
                path: 'account-activation', component: AccountActivationComponent
              }
            ]
          }
        ]
    }
  ,
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
