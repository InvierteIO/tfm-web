import {Component, Input, OnInit} from '@angular/core';
import {ProjectStatus} from '../shared/models/project-status.model';
import {ProjectStageMock} from '../shared/models/project-stage.mock.model';
import {Router} from '@angular/router';
import {ProjectStageStatus} from '../shared/models/project-stage-status.model';

@Component({
  selector: 'app-project-stage-card',
  imports: [],
  standalone: true,
  templateUrl: './project-stage-card.component.html',
  styleUrl: './project-stage-card.component.css'
})
export class ProjectStageCardComponent{
  @Input() projectStatus?: ProjectStatus;
  @Input() stage?: ProjectStageMock;

  edit(): void {
    this.router.navigate(['/public/home/project-stage'], { state: { stage: this.stage } });
  }

  constructor(private readonly router: Router) {
  }

  get isShowNumberApartments() {
    return this.stage?.numberApartments && this.stage?.numberApartments>0;
  }

  get isShowNumberLands() {
    return this.stage?.numberLands && this.stage?.numberLands>0;
  }

  get isShowNumberHouse() {
    return this.stage?.numberHouses && this.stage?.numberHouses>0;
  }

  get isShowEditStage() {
    return (this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED)
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }

  get isShowDeleteStage() {
    return (this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED)
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }

  get isShowPublishStage() {
    return this.projectStatus === ProjectStatus.NOPUBLISHED
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }
}
