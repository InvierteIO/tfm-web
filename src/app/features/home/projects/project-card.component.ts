import {Component, Input} from '@angular/core';
import {ProjectStatus} from './shared/models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectMock} from './shared/models/project.mock.model';
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {LoadingService} from '@core/services/loading.service';
import {ProjectDraftStatus} from './shared/models/project-draft-status';
import {ProjectStoreService} from './shared/services/project-store.service';
import {ProjectActionStatus} from './shared/models/project-action-status';

@Component({
  selector: 'app-project-card',
  imports: [],
  standalone: true,
  templateUrl: './project-card.component.html'
})
export class ProjectCardComponent {
  @Input() propertyCategory: PropertyCategory = PropertyCategory.APARTMENT;
  @Input() project: ProjectMock = { id : 0 };

  constructor(private readonly router: Router,
              private readonly loadingService: LoadingService,
              private readonly projectStore: ProjectStoreService) {
  }

  edit(): void {
    if(this.project.status === ProjectStatus.DRAFT) {
      this.projectStore.setDraftStatus(ProjectDraftStatus.EDIT);
      this.projectStore.setTitleBreadcrumbBase("Editar Proyecto Borrador");
      this.router.navigate(['/public/home/project-draft/section1'], { state: { project: this.project } });
    } else {
      this.projectStore.setStatus(ProjectActionStatus.EDIT);
      this.router.navigate(['/public/home/project-info'], { state: { project: this.project } });
    }
  }

  deleteProject() {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el proyecto?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => { this.loadingService.hide(); }, 1000);
        }
      });
  }

  view() {
    if(this.project.status === ProjectStatus.DRAFT) {
      this.projectStore.setDraftStatus(ProjectDraftStatus.VIEW);
      this.projectStore.setTitleBreadcrumbBase("Ver Proyecto Borrador");
      this.router.navigate(['/public/home/project-draft/section1'], { state: { project: this.project } });
    } else {
      this.projectStore.setStatus(ProjectActionStatus.VIEW);
      this.router.navigate(['/public/home/project-info'], { state: { project: this.project } });
    }
  }

  get isShowNumberApartments() {
    return this.project.numberApartments && this.project.numberApartments>0;
  }

  get isShowNumberLands() {
    return this.project.numberLands && this.project.numberLands>0;
  }

  get isShowNumberHouse() {
    return this.project.numberHouses && this.project.numberHouses>0;
  }

  get isShowEditProject() {
   return this.project.status === ProjectStatus.DRAFT || this.project.status === ProjectStatus.NOPUBLISHED;
 }

  get isShowDeleteProject() {
    return this.project.status === ProjectStatus.DRAFT || this.project.status === ProjectStatus.NOPUBLISHED;
  }

  get isShowPublishProject() {
    return this.project.status === ProjectStatus.NOPUBLISHED;
  }

  get isShowProjectProgress() {
    return this.project.status === ProjectStatus.ACTIVE;
  }
}
