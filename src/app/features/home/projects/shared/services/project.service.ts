import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {ProjectMock} from '../models/project.mock.model';
import {PropertyCategory} from '../../../../shared/models/property-category.model';
import {ProjectStatus} from '../models/project-status.model';
import {ProjectStageMock} from '../models/project-stage.mock.model';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';
import {ProjectStageStatus} from '../models/project-stage-status.model';
import {ProjectDocumentMock} from '../models/project-document.mock.model';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from "@env";
@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static readonly END_POINT_COMPANY = environment.REST_CORE + '/real-estate-companies';

  constructor(private readonly httpService: HttpService) {
  }

  readDraft(taxIdentificationNumber: string): Observable<ProjectMock | undefined> {
    if(localStorage.getItem('project_draft_new')) {
      const projectDaft =  JSON.parse(localStorage.getItem('project_draft_new')!);
      const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(projectDaft.id)}`;
      return this.httpService
      .error("Error obteniendo información del proyecto")
      .get(url)
      .pipe(
        map((project: ProjectMock) => {
          console.log("Project read from DB successfully");
          this.save(project);
          return project;
        }),
        catchError(error => {
          console.error("Error getting Project", error);
          return throwError(() => new Error('Error getting Project'));
        })
      );
    }
    return of();
  }

  save(project: ProjectMock): Observable<ProjectMock> {
    localStorage.setItem('project_draft_new', JSON.stringify(project));
    return of(project);
  }

  generateProjectStageMock(project: ProjectMock): ProjectMock {
    const romanStages = ['I', 'II', 'III', 'IV', 'V'];

    if (!project.projectStages) {
      project.projectStages = [];
    }

    const currentCount = project.projectStages.length;
    const targetCount = project.stages ?? 0;

    if (targetCount > currentCount && currentCount < romanStages.length) {
      const roman = romanStages[currentCount];
      project.projectStages.push({
        name: `Etapa ${roman}`,
        stage: roman,
        commercializationCycle: CommercializationCycle.PRE_SALES,
        status: ProjectStageStatus.DRAFT
      });
    }
    console.log("Modified project with new stage", project);
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

  createDraft(project: ProjectMock, taxIdentificationNumber: string): Observable<ProjectMock> {
      this.generateProjectStageMock(project);
      const projectDaft =  JSON.parse(localStorage.getItem('project_draft_new')!);
      if(projectDaft.id) {
        return this.updateDraft(project, taxIdentificationNumber);
      }
      return this.saveDraft(project, taxIdentificationNumber);
  }

  saveDraft(project: ProjectMock, taxIdentificationNumber: string): Observable<ProjectMock> {
      const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects`;
      console.log(project);
      return this.httpService
      .error("Error guardando información del proyecto")
      .post(url, project)
      .pipe(
        map((project: ProjectMock) => {
          console.log("Project created successfully as Draft");
          this.save(project)
          return project;
        }),
        catchError(error => {
          console.error("create project failed", error);
          return throwError(() => new Error('Create project failed'));
        })
      );
  }

  updateDraft(project: ProjectMock, taxIdentificationNumber: string): Observable<ProjectMock> {
      const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(project.id)}`;
      console.log(project);
      return this.httpService
      .error("Error guardando información del proyecto")
      .put(url, project)
      .pipe(
        map((project: ProjectMock) => {
          console.log("Project updated successfully as Draft");
          this.save(project)
          return project;
        }),
        catchError(error => {
          console.error("Update project failed", error);
          return throwError(() => new Error('Update project failed'));
        })
      );
  }

  uploadDocument(taxIdentificationNumber: string, projectId: number,
    file: File, projectDocument: ProjectDocumentMock): Observable<ProjectDocumentMock> {
    const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(projectId)}/documents`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectDocument', new Blob([JSON.stringify(projectDocument)], { type: 'application/json' }));

    return this.httpService
      .error('Error cargando documento')
      .post(url, formData)
      .pipe(
        map((document: ProjectDocumentMock) => {
          console.log('Document uploaded successfully');
          return document;
        }),
        catchError(error => {
          console.error('Upload document failed', error);
          return throwError(() => new Error('Upload document failed'));
        })
      );
  }

  removeDocument(taxIdentificationNumber: string, projectId: number, projectDocumentId: number): Observable<void> {
    const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(projectDocumentId)}`;

    return this.httpService
      .error('Error eliminando documento')
      .delete(url)
      .pipe(
        catchError(error => {
          console.error('Remove document failed', error);
          return throwError(() => new Error('Remove document failed'));
        })
      );
  }

}
