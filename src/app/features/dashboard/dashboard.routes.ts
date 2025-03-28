import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {MembershipComponent} from './membership/membership.component';

export const dashboardRoutes: Routes = [
  {
    path: 'membership', component: MembershipComponent,
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
