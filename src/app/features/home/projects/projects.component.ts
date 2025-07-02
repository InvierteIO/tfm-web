import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LowerCasePipe} from '@angular/common';
import {ProjectCardComponent} from './project-card.component';
import {ProjectStatus} from './shared/models/project-status.model';
import {PropertyCategory} from '../../shared/models/property-category.model';
import {ProjectService} from './shared/services/project.service';
import {ProjectMock} from './shared/models/project.mock.model';
import {Router} from "@angular/router";
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {ProjectStoreService} from './shared/services/project-store.service';
import {ProjectActionStatus} from './shared/models/project-action-status';
import {LoadingService} from '@core/services/loading.service';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ProjectCardComponent,
    LowerCasePipe,
    DropdownSearchComponent
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

  constructor(private readonly router: Router,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService,
              private readonly authService: AuthService,
              private readonly projectStore: ProjectStoreService) { }

  create(): void {
    this.projectStore.setStatus(ProjectActionStatus.NEW);
    this.router.navigate(['/public/home/project-new/section1']);
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    let taxIdentificationNumber = this.authService.getTexIdentificationNumber();
    console.log('Buscando por:', this.selectedFilter);
    console.log('this.categoryCurrent:', this.categoryCurrent,  ' - statusCurrent:', this.statusCurrent);

    this.loadingService.show();
    this.projectService.listProject(this.categoryCurrent, this.statusCurrent, "", taxIdentificationNumber!)
      .subscribe(projects => {
        this.projects = projects;
        console.log(this.projects);
        this.loadingService.hide();
      });
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
