import {Component, OnInit} from '@angular/core';
import {ProjectMock} from '../shared/models/project.mock.model';
import {Router} from '@angular/router';
import {ProjectStageDtoMock} from '../shared/models/project-stage.mock.dto.model';
import {ProjectStageService} from '../shared/services/project-stage.service';
import {ProjectStageCardComponent} from './project-stage-card.component';
import {ProjectInfoGeneralComponent} from "./project-info-general.component";
import {ProjectDocumentsComponent} from './project-documents.component';
import {
  ProjectPropertyTypesComponent
} from '../shared/components/project-property-types/project-property-types.component';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {ProjectStoreService} from '../shared/services/project-store.service';
import {ProjectActionStatus} from '../shared/models/project-action-status';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    NgbNavModule,
    ProjectStageCardComponent,
    ProjectInfoGeneralComponent,
    ProjectDocumentsComponent,
    ProjectPropertyTypesComponent
  ],
  templateUrl: './project-info.component.html'
})
export class ProjectInfoComponent implements OnInit {
  project?: ProjectMock;
  stages: ProjectStageDtoMock[] = [];
  activeId: string = 'detail';

  constructor(private router: Router,
              private readonly projectStageSvc: ProjectStageService,
              protected readonly projectStore: ProjectStoreService) {
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
    this.activeId = nav?.extras.state?.['activeId'] ?? 'detail';

    if((this.project?.id ?? 0) === 0) {
      this.router.navigate(['/public/home/projects']);
    }
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.projectStageSvc.listStage(this.project)
      .subscribe(stages => {
        this.stages = stages;
      });
  }

  back(): void {
    this.router.navigate(['/public/home/projects']);
  }

  get isViewPage(): boolean {
    return this.projectStore.status() === ProjectActionStatus.VIEW;
  }
}
