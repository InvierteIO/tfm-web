import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {DocumentMock} from '../models/document.mock.model';
import { catchError, concatMap, finalize, map, tap, switchMap} from 'rxjs/operators';
import {StagePropertyGroupDtoMock} from '../models/stage-property-group.dto.mock.model';
import {PropertyGroupMock} from '../models/property-group.mock.model';
import {ProjectMock} from '../models/project.mock.model';
import { environment } from "@env";

@Injectable({
  providedIn: 'root'
})
export class ProjectPropertyTypesService {

  static readonly END_POINT_COMPANY = environment.REST_CORE + '/real-estate-companies';

  public project: ProjectMock = { id : 0 };

  constructor(private readonly httpService: HttpService) {
  }

  readStagePropertyGroupByProject(project: ProjectMock): Observable<StagePropertyGroupDtoMock[]> {
    const stageIds = (project.projectStages ?? []).map(stage => stage.id);
    this.project = project;
    console.log('project: - readStagePropertyGroupByProject', this.project);

    return this.getMockAll()
      .pipe(
        map(stagePropertyGroups =>
          stagePropertyGroups.filter(spg => spg.stage && stageIds.includes(spg.stage.id))));
  }

  readStagePropertyGroupByPropertyType(propertyGroup: PropertyGroupMock): Observable<StagePropertyGroupDtoMock[]> {
    return this.getMockAll().pipe(
      map(stagePropertyGroups =>
        stagePropertyGroups.filter(spg =>
          spg.propertyGroup && spg.propertyGroup.id === propertyGroup.id
        )
      ));
  }

  private getMockAll(): Observable<StagePropertyGroupDtoMock[]> {
    const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/projects/${encodeURIComponent(this.project.id)}/property-groups`;
    return this.httpService
    .error("Error obteniendo información del tipos de propiedades")
    .get(url)
    .pipe(
      map((stagePropertyGroups: StagePropertyGroupDtoMock[]) => {
        console.log("stagePropertyGroup read from DB successfully");
        return stagePropertyGroups;
      }),
      catchError(error => {
        console.error("Error getting stagePropertyGroup", error);
        return throwError(() => new Error('Error getting stagePropertyGroup'));
      })
    );
  }

  private logicMockWithLastId(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
    return this.getMockAll().pipe(
      map(existingGroups => {
        const uniqueGroups = existingGroups
          .map(spg => spg.propertyGroup)
          .filter((group): group is PropertyGroupMock => !!group)
          .filter((group, index, groups) =>
            groups.findIndex(g => g && g.id === group.id) === index);

        const startId = 10 + uniqueGroups.length;

        stagePropertyGroups.forEach((spg, index) => {
          spg.propertyGroup!.id = startId + index;
        });

        return stagePropertyGroups;
      })
    );
  }

  create(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
      const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/property-groups`;
      console.log(stagePropertyGroups);
      return this.httpService
      .error("Error guardando información del Tipo de Propiedad")
      .post(url, stagePropertyGroups)
      .pipe(
        map((stagePropertyGroups: StagePropertyGroupDtoMock[]) => {
          console.log("Property-group created successfully");
          return stagePropertyGroups;
        }),
        catchError(error => {
          console.error("create Property-group failed", error);
          return throwError(() => new Error('Create Property-group failed'));
        })
      );
  }

   update(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
        const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/property-groups`;
        console.log(stagePropertyGroups);
        return this.httpService
        .error("Error guardando información del Tipo de Propiedad")
        .put(url, stagePropertyGroups)
        .pipe(
          map((stagePropertyGroups: StagePropertyGroupDtoMock[]) => {
            console.log("Property-group created successfully");
            return stagePropertyGroups;
          }),
          catchError(error => {
            console.error("create Property-group failed", error);
            return throwError(() => new Error('Create Property-group failed'));
          })
        );
   }

   assignment(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
      const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/property-groups/assign`;
      console.log(stagePropertyGroups);
      return this.httpService
      .error("Error asignando Etapa y Tipo de Propiedad")
      .post(url, stagePropertyGroups)
      .pipe(
        map((stagePropertyGroups: StagePropertyGroupDtoMock[]) => {
          console.log("Stage and Property-group created successfully");
          return stagePropertyGroups;
        }),
        catchError(error => {
          console.error("Stage and Property-group failed", error);
          return throwError(() => new Error('Stage and Property-group failed'));
        })
      );
   }

  removePropertyGroup(propertyGroup: PropertyGroupMock, project : ProjectMock): Observable<void> {
      const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/projects/${encodeURIComponent(project.id)}/property-groups/${encodeURIComponent(propertyGroup.id ?? '')}`;
      return this.httpService
      .error("Error eliminando tipo de propiedad")
      .delete(url)
      .pipe(
        catchError(error => {
          console.error("Error when removing propertyGroup", error);
          return throwError(() => new Error('Error when removing propertyGroup'));
        })
      );
  }

  remove(stagePropertyGroup: StagePropertyGroupDtoMock, project: ProjectMock): Observable<void> {
      const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/projects/${encodeURIComponent(project.id)}/stage-property-groups/${encodeURIComponent(stagePropertyGroup.id ?? '')}`;
      return this.httpService
      .error("Error eliminando asignación etapa y tipo de propiedad")
      .delete(url)
      .pipe(
        catchError(error => {
          console.error("Error when removing stage-propertyGroup relationship", error);
          return throwError(() => new Error('Error when removing stage-propertyGroup relationship'));
        })
      );
  }

  duplicate(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
      const url = `${ProjectPropertyTypesService.END_POINT_COMPANY}/${encodeURIComponent('10449080004')}/property-groups/duplicate`;
      console.log(stagePropertyGroups);
      return this.httpService
      .error("Error al duplicar Tipo de Propiedad")
      .post(url, stagePropertyGroups)
      .pipe(
        map((stagePropertyGroups: StagePropertyGroupDtoMock[]) => {
          console.log("Property-group duplication successfully");
          return stagePropertyGroups;
        }),
        catchError(error => {
          console.error("create Property-group failed", error);
          return throwError(() => new Error('Duplication Property-group failed'));
        })
      );
  }

  downloadFile(file: DocumentMock): Observable<void> {
    const path = file.path!;
    const name = file.name;
    console.log(file)
    return this.httpService.toast(true).download()
      .successful(`¡El archivo '${name}' fue descargado!`)
      .get(path)
      .pipe(map(this.buildBlobAndDownload));
  }

  private buildBlobAndDownload(blob: Blob | undefined): void {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }
}
