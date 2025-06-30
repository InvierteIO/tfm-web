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
import {HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static readonly END_POINT_COMPANY = environment.REST_CORE + '/real-estate-companies';

  constructor(private readonly httpService: HttpService) {
  }

  readDraft(taxIdentificationNumber: string, projectDaft: ProjectMock): Observable<ProjectMock | undefined> {

    let projectId : number;
    if (projectDaft && projectDaft.id !== undefined) {
      projectId = projectDaft.id;
    } else {
      return of();
    }

    //const projectDaft =  JSON.parse(localStorage.getItem('project_draft_new')!);
    const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(projectId)}`;
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

    return of();
  }

  save(project: ProjectMock): Observable<ProjectMock> {
    //localStorage.setItem('project_draft_new', JSON.stringify(project));
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
    //localStorage.setItem('project_draft_new', JSON.stringify(project));
    return project;
  }

  listProject(category: PropertyCategory, status: ProjectStatus, search: string, taxIdentificationNumber: string): Observable<ProjectMock[]> {
    return this.listLogicMock(category, status, taxIdentificationNumber);

  }

  listLogicMock(category: PropertyCategory, status: ProjectStatus, taxIdentificationNumber: string): Observable<ProjectMock[]> {
    let list: ProjectMock[] = [];


    const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/summary`;
    return this.httpService
    .param('propertyType', category)
    .param('projectStatus', status)
    .error("Error obteniendo información resumida de proyectos")
    .get(url)
    .pipe(
      map((projectSummary: ProjectMock[]) => {
        console.log("Project summary read from DB successfully");

        projectSummary.forEach((summary: ProjectMock) => {
          list.push(summary);
        })

        return projectSummary;
      }),
      catchError(error => {
        console.error("Error getting Project summary", error);
        return throwError(() => new Error('Error getting Project summary'));
      })
    );
    return of(list);
  }

  createDraft(project: ProjectMock, taxIdentificationNumber: string): Observable<ProjectMock> {
      this.generateProjectStageMock(project);
      //const projectDaft =  JSON.parse(localStorage.getItem('project_draft_new')!);
      if(project.id! > 0) {
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
      const url = `${ProjectService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects/${encodeURIComponent(project.id!)}`;
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
