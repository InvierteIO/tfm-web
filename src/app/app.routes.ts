import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/public/login.component';
import {
  RegisterPersonalInfoComponent
} from './features/auth/sign-up/register-personal-info/register-personal-info.component';
import {
  AccountConfigurationComponent
} from './features/auth/sign-up/account-configuration/account-configuration.component';
import {AccountActivationComponent} from './features/auth/sign-up/account-activation/account-activation.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {LoginInternalComponent} from './features/auth/login/internal/login-internal.component';

export const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'public/auth/login',
    },
    {
        path: 'public',
        children : [
          {
            path: 'auth',
            children : [
              {
                path: 'login', component: LoginComponent
              },
              {
                path: 'forgot-password', component: HomeComponent
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
          },
          {
            path: 'home', component: HomeComponent
          }
        ]
    },
    {
      path: 'internal',
      children : [
        {
          path: 'auth',
          children : [
            {
              path: 'login', component: LoginInternalComponent
            },
            {
              path: 'forgot-password', component: HomeComponent
            }
          ]
        },
        {
          path: 'dashboard', component: DashboardComponent
        }
      ]
    },
    {
      path: '**',
      redirectTo: 'public/auth/login',
      pathMatch: 'full',
    }
];
