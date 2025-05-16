import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, of} from 'rxjs';
import {ProjectMock} from '../models/project.mock.model';
import {PropertyCategory} from '../../../shared/models/property-category.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private readonly httpService: HttpService) {
  }

  listProject(category: PropertyCategory, search: string): Observable<ProjectMock[]> {
    console.log(search);
    if(category == PropertyCategory.LAND) {
      return of([{
        id: 1,
        name: "Proyecto Marmolejo",
        address: "Av. 57b #3 - 25 Bella vista",
        numberApartments:25,
        numberHouses: 10,
        numberLands: 15,
        stages: 3
      }, {
        id: 2,
        name: "Terrenos Las Marias",
        address: "Av. 57b #3 - 25 Las marias",
        numberHouses: 0,
        numberLands: 123,
        stages: 2
      }]);
    }
    if(category == PropertyCategory.APARTMENT) {
      return of([{
        id: 1,
        name: "Proyecto Marmolejo",
        address: "Av. 57b #3 - 25 Bella vista",
        numberApartments:11,
        numberHouses: 11,
        numberLands: 1,
        stages: 4,
        areaTotal: 70
      }, {
        id: 2,
        name: "Terrenos Las Marias",
        address: "Av. 57b #3 - 25 Las marias",
        numberHouses: 1,
        numberLands: 1,
        stages: 1,
        areaTotal: 87
      }]);
    }
    if(category == PropertyCategory.HOUSE) {
      return of([{
        id: 1,
        name: "Proyecto Marmolejo",
        address: "Av. 57b #3 - 25 Bella vista",
        numberApartments:6,
        numberHouses: 5,
        numberLands: 2,
        stages: 4,
        areaTotal: 11
      }, {
        id: 2,
        name: "Terrenos Las Marias",
        address: "Av. 57b #3 - 25 Las marias",
        numberHouses: 6,
        stages: 1,
        areaTotal: 110
      }]);

    }
    return of();
  }

}
