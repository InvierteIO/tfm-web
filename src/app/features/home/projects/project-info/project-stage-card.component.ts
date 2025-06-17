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

  constructor(private readonly router: Router,
              private readonly loadingService: LoadingService) {
  }

  edit(): void {
    this.router.navigate(['/public/home/project-info/stage'], {
      state: { project: this.project, stage: this.stage }
    });
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
