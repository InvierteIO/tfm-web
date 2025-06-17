import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, of} from 'rxjs';
import {DocumentMock} from '../models/document.mock.model';
import {map} from 'rxjs/operators';
import {StagePropertyGroupDtoMock} from '../models/stage-property-group.dto.mock.model';
import {PropertyGroupMock} from '../models/property-group.mock.model';
import {ProjectMock} from '../models/project.mock.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectPropertyTypesService {

  constructor(private readonly httpService: HttpService) {
  }

  readStagePropertyGroupByProject(project: ProjectMock): Observable<StagePropertyGroupDtoMock[]> {
    const stageIds = (project.projectStages ?? []).map(stage => stage.id);
    const stagePropertyGroups = this.getMockAll()
      .filter(spg => spg.stage && stageIds.includes(spg.stage.id));
    return of(stagePropertyGroups);
  }

  readStagePropertyGroupByPropertyType(propertyGroup: PropertyGroupMock): Observable<StagePropertyGroupDtoMock[]> {
    const stagePropertyGroups = this.getMockAll()
      .filter(spg => spg.propertyGroup
        && spg.propertyGroup.id === propertyGroup.id);
    return of(stagePropertyGroups);
  }

  private getMockAll(): StagePropertyGroupDtoMock[] {
    if(localStorage.getItem('stage_property_groups')) {
      return JSON.parse(localStorage.getItem('stage_property_groups')!) as StagePropertyGroupDtoMock[];
    }
    return [];
  }

  private logicMockWithLastId(stagePropertyGroups: StagePropertyGroupDtoMock[]): StagePropertyGroupDtoMock[] {
     const id = 10 + this.getMockAll()
      .map(spg => spg.propertyGroup)
      .filter((group): group is PropertyGroupMock => !!group)
      .filter((group, index, groups) =>
        groups.findIndex(g => g && g.id === group.id) === index).length;

    stagePropertyGroups.forEach((spg: StagePropertyGroupDtoMock) => {
      spg.propertyGroup!.id = id;
    });

    return stagePropertyGroups;
  }

  create(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
    localStorage.setItem('stage_property_groups',
      JSON.stringify(this.getMockAll().concat(this.logicMockWithLastId(stagePropertyGroups))));
    return of(stagePropertyGroups);
  }


  assigment(stagePropertyGroups: StagePropertyGroupDtoMock[]): Observable<StagePropertyGroupDtoMock[]> {
    localStorage.setItem('stage_property_groups',
      JSON.stringify(this.getMockAll().concat(stagePropertyGroups)));
    return of(stagePropertyGroups);
  }

  removePropertyGroup(propertyGroup: PropertyGroupMock): Observable<void> {
    const updated = this.getMockAll()
      .filter(spg => spg.propertyGroup?.id !== propertyGroup.id);
    localStorage.setItem('stage_property_groups', JSON.stringify(updated));
    return of();
  }

  remove(stagePropertyGroup: StagePropertyGroupDtoMock): Observable<void> {
    const updated = this.getMockAll()
      .filter(spg =>
        !(spg.stage?.id === stagePropertyGroup.stage?.id &&
          spg.propertyGroup?.id === stagePropertyGroup.propertyGroup?.id));
    localStorage.setItem('stage_property_groups', JSON.stringify(updated));
    return of();
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
