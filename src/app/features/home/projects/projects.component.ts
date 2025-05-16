import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ProjectCardComponent} from './project-card.component';
import {ProjectStatus} from './models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectService} from './services/project.service';
import {ProjectMock} from './models/project.mock.model';

@Component({
  selector: 'app-projects',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ProjectCardComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
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
    this.projectService.listProject(this.categoryCurrent, "")
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

  protected readonly ProjectStatus = ProjectStatus;
  protected readonly PropertyCategory = PropertyCategory;
}
