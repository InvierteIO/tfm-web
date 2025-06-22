import {Component, Input, OnInit} from '@angular/core';
import {ProjectStatus} from '../shared/models/project-status.model';
import {ProjectStageDtoMock} from '../shared/models/project-stage.mock.dto.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectStageStatus} from '../shared/models/project-stage-status.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from '../shared/models/project.mock.model';

@Component({
  selector: 'app-project-stage-card',
  imports: [],
  standalone: true,
  templateUrl: './project-stage-card.component.html',
  styleUrl: './project-stage-card.component.css'
})
export class ProjectStageCardComponent implements OnInit {
  @Input()
  project?: ProjectMock;
  projectStatus?: ProjectStatus;
  @Input() stage?: ProjectStageDtoMock;
  @Input()
  isView = false;

  constructor(private readonly router: Router,
              private readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.projectStatus = this.project?.status;
  }

  deleteProjectStage() {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar la etapa de proyecto?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => { this.loadingService.hide(); }, 1000);
        }
      });
  }

  edit(): void {
    this.router.navigate(['/public/home/project-info/stage'], {
      state: { project: this.project, stage: this.stage }
    });
  }

  view():void {
    this.router.navigate(['/public/home/project-info/stage'], {
      state: { project: this.project, stage: this.stage, view: true }
    });
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
    if(this.isView) return false;
    return (this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED)
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }

  get isShowDeleteStage() {
    if(this.isView) return false;
    return (this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED)
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }

  get isShowPublishStage() {
    if(this.isView) return false;
    return this.projectStatus === ProjectStatus.NOPUBLISHED
      && this.stage?.status === ProjectStageStatus.DRAFT;
  }
}
