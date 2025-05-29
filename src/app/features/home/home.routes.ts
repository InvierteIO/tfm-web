import { Routes } from '@angular/router';
import {MaintenancePageComponent} from '../shared/components/maintenance-page/maintenance-page.component';
import {StaffProfileComponent} from './staff-profile/staff-profile.component';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectInfoComponent} from "./projects/project-info/project-info.component";
import {SectionOneComponent} from './projects/project-creation/section-one/section-one.component';
import {PropertyTypeComponent} from './projects/project-creation/property-type/property-type.component';
import {
  InfrastructureInstallationComponent
} from './projects/project-creation/infrastructure-installation/infrastructure-installation.component';
import {ComplementaryComponent} from './projects/project-creation/complementary/complementary.component';
import {PropertiesComponent} from "./projects/project-creation/properties/properties.component";
import {
  LegalScopeHabilitationComponent
} from './projects/project-creation/legal-scope-habilitation/legal-scope-habilitation.component';

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
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'maintenance',
    pathMatch: 'full'
  }
];
