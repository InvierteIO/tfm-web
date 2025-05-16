import {Component, Input} from '@angular/core';
import {ProjectStatus} from './models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectMock} from './models/project.mock.model';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() projectStatus: ProjectStatus = ProjectStatus.ACTIVE;
  @Input() propertyCategory: PropertyCategory = PropertyCategory.APARTMENT;
  @Input() project: ProjectMock = { id : 1 };

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
   return this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED;
 }

  get isShowDeleteProject() {
    return this.projectStatus === ProjectStatus.DRAFT || this.projectStatus === ProjectStatus.NOPUBLISHED;
  }

  get isShowPublishProject() {
    return this.projectStatus === ProjectStatus.NOPUBLISHED;
  }

  get isShowProjectProgress() {
    return this.projectStatus === ProjectStatus.ACTIVE;
  }
}
