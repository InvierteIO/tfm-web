import {Component, Input} from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavLinkBase, NgbNavLinkButton, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ProjectStageInfoGeneralComponent} from './project-stage-info-general.component';
import {ProjectStageInfoBonusBankComponent} from './project-stage-info-bonus-bank.component';
import {
  InfrastructureInstallationComponent
} from '../../../shared/components/infraestructure-installation/infrastructure-installation.component';
import {ProjectStageDtoMock} from '../../../shared/models/project-stage.mock.dto.model';
import {
  LocationInformationComponent
} from '../../../shared/components/location-information/location-information.component';
import {ProjectStageInfoLocationComponent} from './project-stage-info-location.component';

@Component({
  selector: 'app-project-stage-details',
  imports: [
    NgbNavModule,
    NgbNav,
    NgbNavContent,
    NgbNavLinkBase,
    NgbNavLinkButton,
    ProjectStageInfoGeneralComponent,
    ProjectStageInfoBonusBankComponent,
    InfrastructureInstallationComponent,
    ProjectStageInfoLocationComponent,
  ],
  templateUrl: './project-stage-details.component.html'
})
export class ProjectStageDetailsComponent {
  @Input()
  projectStage?: ProjectStageDtoMock;
}
