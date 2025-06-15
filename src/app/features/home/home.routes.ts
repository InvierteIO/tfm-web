import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {SectionOneComponent} from './projects/project-creation/section-one/section-one.component';
import {PropertyTypeComponent} from './projects/shared/components/property-type/property-type.component';
import {
  InfrastructureInstallationComponent
} from './projects/project-creation/infrastructure-installation/infrastructure-installation.component';
import {ComplementaryComponent} from './projects/project-creation/complementary/complementary.component';
import {PropertiesComponent} from "./projects/project-creation/properties/properties.component";
import {
  LegalScopeHabilitationComponent
} from './projects/project-creation/legal-scope-habilitation/legal-scope-habilitation.component';
import {TitleSplitsComponent} from './projects/project-creation/title-splits/title-splits.component';
import {UserManagementComponent} from "./user-management/user-management.component";
import {SectionTwoComponent} from './projects/project-creation/section-two/section-two.component';

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
    ]
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
