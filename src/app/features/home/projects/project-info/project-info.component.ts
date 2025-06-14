import {Component, OnInit} from '@angular/core';
import {ProjectMock} from '../shared/models/project.mock.model';
import {Router} from '@angular/router';
import {ProjectStatus} from '../shared/models/project-status.model';
import {ProjectStageMock} from '../shared/models/project-stage.mock.model';
import {ProjectStageService} from '../shared/services/project-stage.service';
import {ProjectStageCardComponent} from './project-stage-card.component';
import {ProjectInfoGeneralComponent} from "./project-info-general.component";
import {ProjectDocumentsComponent} from './project-documents.component';
import {ProjectPropertyTypesComponent} from '../shared/components/project-property-types/project-property-types.component';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    ProjectStageCardComponent,
    ProjectInfoGeneralComponent,
    ProjectDocumentsComponent,
    ProjectPropertyTypesComponent
  ],
  templateUrl: './project-info.component.html'
})
export class ProjectInfoComponent implements OnInit {
  project?: ProjectMock;
  statusCurrent?: ProjectStatus;
  stages: ProjectStageMock[] = [];

  constructor(private router: Router,
              private readonly projectStageSvc: ProjectStageService) {
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];

    if((this.project?.id ?? 0) === 0) {
      this.router.navigate(['/public/home/projects']);
    }
    this.statusCurrent = this.project?.status;
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
}
