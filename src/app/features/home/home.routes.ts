import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";

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
    path: 'project-info', component: ProjectInfoComponent
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
