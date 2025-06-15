import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, of} from 'rxjs';
import {ProjectMock} from '../models/project.mock.model';
import {ProjectStageDtoMock} from '../models/project-stage.mock.dto.model';
import {ProjectStageStatus} from '../models/project-stage-status.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectStageService {

  constructor(private readonly httpService: HttpService) {
  }

  listStage(project?: ProjectMock): Observable<ProjectStageDtoMock[]> {
    return of([{
      id: 1,
      name: "Etapa Inicial",
      address: "Av. 11b #2 - 25 Bella vista",
      numberApartments:25,
      numberHouses: 1,
      numberLands: 75,
      areaTotal: 100,
      typesProperty: 4,
      stage: "I",
      status: ProjectStageStatus.DRAFT
    }, {
      id: 2,
      name: "Etapa 2025",
      address: "Av. 57b #3 - 25 Las marias",
      numberHouses: 0,
      numberLands: 123,
      areaTotal: 420,
      typesProperty: 2,
      stage: "II",
      status: ProjectStageStatus.DRAFT
    }]);
  }

}
