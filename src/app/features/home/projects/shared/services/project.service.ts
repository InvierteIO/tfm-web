import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, of} from 'rxjs';
import {ProjectMock} from '../models/project.mock.model';
import {PropertyCategory} from '../../../../shared/models/property-category.model';
import {ProjectStatus} from '../models/project-status.model';
import {ProjectStageMock} from '../models/project-stage.mock.model';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';
import {ProjectStageStatus} from '../models/project-stage-status.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private readonly httpService: HttpService) {
  }

  readDraft(): Observable<ProjectMock | undefined> {
    if(localStorage.getItem('project_draft_new')) {
      const projectDaft =  JSON.parse(localStorage.getItem('project_draft_new')!);
      return of(projectDaft as ProjectMock);
    }
    return of();
  }

  createDraft(project: ProjectMock): Observable<ProjectMock> {
    this.generateProjectStageMock(project);
    return of(project);
  }

  generateProjectStageMock(project: ProjectMock): ProjectMock {
    let projectStages: ProjectStageMock[] = [];
    const romanStages = ['I', 'II', 'III', 'IV', 'V'];

    Array.from({ length: project?.stages! }, (_, i) => {
      const roman = romanStages[i];
      projectStages.push({
        id: 10 + i,
        name: `Etapa ${roman}`,
        stage: roman,
        commercializationCycle: CommercializationCycle.PRE_SALES,
        status: ProjectStageStatus.DRAFT
      })
    });
    project.id = 10;
    project.projectStages = projectStages;
    project.status = ProjectStatus.DRAFT
    localStorage.setItem('project_draft_new', JSON.stringify(project));
    return project;
  }

  listProject(category: PropertyCategory, status: ProjectStatus, search: string): Observable<ProjectMock[]> {
    let list = this.listLogicMock(category, status);
    return of(list);
  }

  listLogicMock(category: PropertyCategory, status: ProjectStatus): ProjectMock[] {
    let list: ProjectMock[] = [];
    if(category == PropertyCategory.LAND) {
      list = [{
        id: 1,
        name: "Proyecto Marmolejo",
        address: "Av. 57b #3 - 25 Bella vista",
        numberApartments:25,
        numberHouses: 1,
        numberLands: 75,
        areaTotal: 700,
        stages: 3,
        status: ProjectStatus.DRAFT
      }, {
        id: 2,
        name: "Terrenos Las Marias",
        address: "Av. 57b #3 - 25 Las marias",
        numberHouses: 0,
        numberLands: 123,
        areaTotal: 820,
        stages: 2,
        status: ProjectStatus.DRAFT
      }];
    }
    if(category == PropertyCategory.APARTMENT) {
      list = [{
        id: 3,
        name: "Proyecto XYZ",
        address: "Av. 57b #3 - 25 Bella vista",
        numberApartments:17,
        numberHouses: 11,
        numberLands: 1,
        stages: 4,
        areaTotal: 70,
        status: ProjectStatus.DRAFT
      }, {
        id: 4,
        name: "Edificios Solos",
        address: "Av. 12b #3 - 25 Solo",
        numberApartments:11,
        numberHouses: 1,
        numberLands: 0,
        stages: 1,
        areaTotal: 87,
        status: ProjectStatus.DRAFT
      }];
    }
    if(category == PropertyCategory.HOUSE) {
      list = [{
        id: 5,
        name: "Proyecto Galicias",
        address: "Av. 4b #11 - 1 Quiñones Gonzales",
        numberApartments:6,
        numberHouses: 5,
        numberLands: 2,
        stages: 4,
        areaTotal: 11,
        status: ProjectStatus.DRAFT
      }, {
        id: 6,
        name: "Proyecto Juan Pablo II",
        address: "Av. 11b #4 - Chiclayo",
        numberHouses: 6,
        stages: 1,
        areaTotal: 110,
        status: ProjectStatus.NOPUBLISHED
      }, {
        id: 7,
        name: "Proyecto Leon IV",
        address: "Av. 11b #4 - Trujillo",
        numberHouses: 99,
        stages: 2,
        areaTotal: 166,
        status: ProjectStatus.ACTIVE
      }, {
        id: 8,
        name: "Proyecto Fe y Alegria",
        address: "Av. 11b #4 - Lima",
        numberHouses: 88,
        stages: 1,
        areaTotal: 199,
        status: ProjectStatus.DISABLED
      }];
    }
    return list.filter(project => project.status === status);
  }
}
