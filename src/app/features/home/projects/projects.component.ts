import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ProjectCardComponent} from './project-card.component';
import {ProjectStatus} from './shared/models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectService} from './shared/services/project.service';
import {ProjectMock} from './shared/models/project.mock.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ProjectCardComponent
  ],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  protected readonly PROJECT_STATUS = ProjectStatus;
  protected readonly PROPERTY_CATEGORY = PropertyCategory;

  selectedFilter: string = 'Nombre';
  categoryCurrent: PropertyCategory = PropertyCategory.APARTMENT;
  statusCurrent: ProjectStatus = ProjectStatus.ACTIVE;
  projects: ProjectMock[] = [];

  constructor(private readonly projectService: ProjectService) { }

  create(): void {
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    console.log('Buscando por:', this.selectedFilter);
    this.projectService.listProject(this.categoryCurrent, this.statusCurrent, "")
      .subscribe(projects => {
        this.projects = projects;
        console.log(this.projects);
      });
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  onStatusTabClick(status: ProjectStatus, event: Event): void {
    event.preventDefault();
    this.statusCurrent = status;
    console.log('Tab de estado:', status);
    this.search();
  }

  onCategoryClick(category: PropertyCategory, event: Event): void {
    event.preventDefault();
    this.categoryCurrent = category;
    console.log('Categoría seleccionada:', category);
    this.search();
  }
}
