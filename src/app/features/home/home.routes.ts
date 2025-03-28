import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';

export const homeRoutes: Routes = [
  {
    path: 'maintenance', component: MaintenancePageComponent
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
