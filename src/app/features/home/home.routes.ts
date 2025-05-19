import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {LoginInternalComponent} from '../auth/login/internal/login-internal.component';
import {AuthRedirectGuard} from '@core/services/auth-redirect-guard.service';
import {HomeComponent} from './home.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {RoleGuardService} from '@core/services/role-guard.service';
import {Role} from '@core/models/role.model';
import {SectionOneComponent} from './projects/project-creation/section-one/section-one.component';

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
    path: 'project-new',
    children : [
      {
        path: 'section1', component: SectionOneComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
