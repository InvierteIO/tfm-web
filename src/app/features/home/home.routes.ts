import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {SectionOneComponent} from './projects/project-creation/section-one/section-one.component';
import {PropertyTypeComponent} from './projects/shared/components/property-type/property-type.component';
import {
  InfrastructureInstallationComponent
} from './projects/shared/components/infrastructure-installation/infrastructure-installation.component';
import {ComplementaryComponent} from './projects/project-creation/complementary/complementary.component';
import {PropertiesComponent} from "./projects/shared/components/properties/properties.component";
import {
  LegalScopeHabilitationComponent
} from './projects/project-creation/legal-scope-habilitation/legal-scope-habilitation.component';
import {TitleSplitsComponent} from './projects/shared/components/title-splits/title-splits.component';
import {UserManagementComponent} from "./user-management/user-management.component";
import {SectionTwoComponent} from './projects/project-creation/section-two/section-two.component';
import {ProjectStageComponent} from './projects/project-info/project-stage/project-stage.component';
import {ProjectStateGuard} from './projects/shared/services/project-state.guard';
import {ClientsListComponent} from './clients/components/clients-list/clients-list.component';
import {ClientFormComponent} from './clients/components/client-form/client-form.component';

const projectCreationChildrenRoutes: Routes = [
  {
    path: 'section1', component: SectionOneComponent
  },
  {
    path: 'section2', component: SectionTwoComponent
  },
  {
    path: 'property-type', component: PropertyTypeComponent
  },
  {
    path: 'infrastructure-installation', component: InfrastructureInstallationComponent
  },
  {
    path: 'complementary', component: ComplementaryComponent
  },
  {
    path: 'properties', component: PropertiesComponent
  },
  {
    path: 'legal-scope', component: LegalScopeHabilitationComponent
  },
  {
    path: 'title-splits', component: TitleSplitsComponent
  }
];

export const homeRoutes: Routes = [
  {
    path: 'profile', component: StaffProfileComponent
  },
  {
    path: 'maintenance', component: MaintenancePageComponent
  },
  {
    path: 'users', component: UserManagementComponent
  },
  {
    path: 'projects', component: ProjectsComponent,
    canActivateChild: [ProjectStateGuard],
  },
  {
    path: 'project-info',
    children : [
      {
        path: '',
        component: ProjectInfoComponent
      },
      {
        path: 'stage',
        component: ProjectStageComponent
      },
      {
        path: 'property-type', component: PropertyTypeComponent
      },
      {
        path: 'properties', component: PropertiesComponent
      }
    ]
  },
  {
    path: 'project-new',
    children : projectCreationChildrenRoutes,
    canActivateChild: [ProjectStateGuard],
  },
  {
    path: 'project-draft',
    children : projectCreationChildrenRoutes
  },
  {
    path: 'clients',
    children: [
      { path: '', component: ClientsListComponent },
      {
        path: 'new',
        component: ClientFormComponent,
        data: { mode: 'new' }
      },
      {
        path: 'edit/:id',
        component: ClientFormComponent,
        /*canActivate: [ClientExistsGuard],
        resolve: { client: ClientResolver },*/
        data: { mode: 'edit' }
      },
      {
        path: 'view/:id',
        component: ClientFormComponent,
        /*canActivate: [ClientExistsGuard],
        resolve: { client: ClientResolver },*/
        data: { mode: 'view' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
