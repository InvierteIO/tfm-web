import {Component, Input} from '@angular/core';
import {ProjectStatus} from './shared/models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectMock} from './shared/models/project.mock.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-card',
  imports: [],
  standalone: true,
  templateUrl: './project-card.component.html'
})
export class ProjectCardComponent {
  @Input() propertyCategory: PropertyCategory = PropertyCategory.APARTMENT;
  @Input() project: ProjectMock = { id : 0 };

  constructor(private readonly router: Router) {
  }

  edit(): void {
    this.router.navigate(['/public/home/project-info'], { state: { project: this.project } });
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
