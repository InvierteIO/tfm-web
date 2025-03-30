import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {MembershipComponent} from './membership/membership.component';
import {OperatorProfileComponent} from './operator-profile/operator-profile.component';

export const dashboardRoutes: Routes = [
  {
    path: 'memberships', component: MembershipComponent,
  },
  {
    path: 'profile', component: OperatorProfileComponent,
  },
  {
    path: 'maintenance', component: MaintenancePageComponent
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
