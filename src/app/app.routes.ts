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
import {MaintenancePageComponent} from './features/shared/components/maintenance-page/maintenance-page.component';
import { Role } from '@core/models/role.model';
import { RoleGuardService } from '@core/services/role-guard.service';

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
            path: 'home', component: HomeComponent,
            canActivate: [RoleGuardService],
            data: { roles: [Role.AGENT, Role.OWNER] },
            children: [
              {
                path: 'maintenance', component: MaintenancePageComponent
              },
              {
                path: '**',
                redirectTo: 'maintenance',
                pathMatch: 'full'
              }
            ]
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
          path: 'dashboard', component: DashboardComponent,
          canActivate: [RoleGuardService],
          data: { roles: [Role.ADMIN, Role.SUPPORT] },
          children: [
            {
              path: 'maintenance', component: MaintenancePageComponent
            },
            {
              path: '**',
              redirectTo: 'maintenance',
              pathMatch: 'full'
            }
          ]
        }   
      ]
    },
    {
      path: '**',
      redirectTo: 'public/auth/login',
      pathMatch: 'full',
    }
];
