import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable} from 'rxjs';
import {LocationCode} from '../models/location-code.mock.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeographicalLocationService {
  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<LocationCode[]> {
    return this.httpService.get('assets/mock/locations.json');
  }

  listRegions(): Observable<LocationCode[]> {
    return this.readAll().pipe(
      map(locations => locations.filter(l => l.type === 'REGION'))
    );
  }

  listProvinces(regionCode: string): Observable<LocationCode[]> {
    const prefix = regionCode.substring(0, 2);
    return this.readAll().pipe(
      map(locations =>
        locations.filter(l => l.type === 'PROVINCE' && l.code.startsWith(prefix))
      )
    );
  }

  listDistricts(provinceCode: string): Observable<LocationCode[]> {
    const prefix = provinceCode.substring(0, 4);
    return this.readAll().pipe(
      map(locations =>
        locations.filter(l => l.type === 'DISTRICT' && l.code.startsWith(prefix))
      )
    );
  }
}
