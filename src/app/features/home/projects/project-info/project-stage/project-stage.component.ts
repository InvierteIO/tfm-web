import {Component} from '@angular/core';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ProjectService} from '../../shared/services/project.service';
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from "../../shared/models/project.mock.model";
import {ProjectStageDtoMock} from "../../shared/models/project-stage.mock.dto.model";
import {StagePropertyTypeComponent} from "./stage-property-type.component";
import {ProjectStageDetailsComponent} from "./project-stage-details/project-stage-details.component";
import {ProjectStoreService} from '../../shared/services/project-store.service';
import {ProjectActionStatus} from '../../shared/models/project-action-status';

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
  private isView = false;
  activeId: string = 'detail';
  constructor(private readonly router: Router,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService,
              private readonly projectStore: ProjectStoreService) {
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
    this.projectStage = nav?.extras.state?.['stage'];
    this.isView = nav?.extras.state?.['view'];
    this.activeId = nav?.extras.state?.['activeId'] ?? 'detail';
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

  get isViewPage() {
    return this.projectStore.status() === ProjectActionStatus.VIEW || this.isView;
  }
}
