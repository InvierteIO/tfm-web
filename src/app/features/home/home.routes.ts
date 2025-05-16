import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';

export const homeRoutes: Routes = [
  {
    path: 'profile', component: StaffProfileComponent
  },
  {
    path: 'maintenance', component: MaintenancePageComponent
  },
  {
    path: 'projects', component: ProjectsComponent
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
