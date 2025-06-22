import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/public/login.component';
import { RegisterPersonalInfoComponent } from './features/auth/sign-up/register-personal-info/register-personal-info.component';
import { AccountConfigurationComponent } from './features/auth/sign-up/account-configuration/account-configuration.component';
import { AccountActivationComponent } from './features/auth/sign-up/account-activation/account-activation.component';
import { AccountConfirmationComponent } from './features/auth/sign-up/account-confirmation/account-confirmation.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginInternalComponent } from './features/auth/login/internal/login-internal.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { Role } from '@core/models/role.model';
import { RoleGuardService } from '@core/guards/role.guard.service';
import { AuthRedirectGuard } from '@core/guards/auth-redirect.guard';


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
                path: 'login', component: LoginComponent,
                canActivate: [AuthRedirectGuard]
              },
              {
                path: 'forgot-password', component: ForgotPasswordComponent
              },
              {
                path: 'signup',
                children : [
                  {
                    path: 'register-info', component: RegisterPersonalInfoComponent,
                    canActivate: [AuthRedirectGuard]
                  },
                  {
                    path: 'account-configuration', component: AccountConfigurationComponent,
                    canActivate: [AuthRedirectGuard]
                  },
                  {
                    path: 'account-activation', component: AccountActivationComponent,
                    canActivate: [AuthRedirectGuard]
                  },
                  {
                    path: 'account-confirmation/:token', component: AccountConfirmationComponent,
                    //canActivate: [AuthRedirectGuard]
                  }
                ]
              }
            ]
          },
          {
            path: 'home', component: HomeComponent,
            //canActivate: [RoleGuardService],
            data: { roles: [Role.REALTOR, Role.OWNER, Role.ADMINISTRATIVE_ASSISTANT] },
            loadChildren: () =>
              import('./features/home/home.routes')
                .then((m) => m.homeRoutes),
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
              path: 'login', component: LoginInternalComponent,
              canActivate: [AuthRedirectGuard]
            },
            {
              path: 'forgot-password', component: HomeComponent,
              canActivate: [AuthRedirectGuard]
            }
          ]
        },
        {
          path: 'dashboard', component: DashboardComponent,
          canActivate: [RoleGuardService],
          data: { roles: [Role.ADMIN, Role.SUPPORT] },
          loadChildren: () =>
            import('./features/dashboard/dashboard.routes')
              .then((m) => m.dashboardRoutes),
        }
      ]
    },
    {
      path: '**',
      redirectTo: 'public/auth/login',
      pathMatch: 'full',
    }
];

