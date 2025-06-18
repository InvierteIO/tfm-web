import { Component } from '@angular/core';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ProjectService} from '../../shared/services/project.service';
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from "../../shared/models/project.mock.model";
import {ProjectStageDtoMock} from "../../shared/models/project-stage.mock.dto.model";
import {StagePropertyTypeComponent} from "./stage-property-type.component";
import {ProjectStageDetailsComponent} from "./project-stage-details/project-stage-details.component";

@Component({
  selector: 'app-project-stage',
  standalone: true,
    imports: [
        NgbNavModule,
        StagePropertyTypeComponent,
        ProjectStageDetailsComponent
    ],
  templateUrl: './project-stage.component.html'
})
export class ProjectStageComponent {
  project?: ProjectMock;
  projectStage?: ProjectStageDtoMock;

  constructor(private readonly router: Router,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService) {
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
    this.projectStage = nav?.extras.state?.['stage'];
    if((this.project?.id ?? 0) === 0) {
      this.router.navigate(['/public/home/projects']);
    }
  }

  toProjects(): void {
    this.router.navigate(['/public/home/projects']);
  }

  toProjectInfo() {
    this.router.navigate(['/public/home/project-info'], { state: { project: this.project} });
  }
}
