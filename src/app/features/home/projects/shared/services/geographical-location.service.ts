import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {LocationCode} from '../models/location-code.mock.model';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from "@env";

@Injectable({
  providedIn: 'root'
})
export class GeographicalLocationService {
  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<LocationCode[]> {
    const url = `${environment.REST_CORE}/location-codes`;
    return this.httpService
    .error("Error obteniendo códigos de ubicación")
    .get(url)
    .pipe(
      map((locationCodes: LocationCode[]) => {
        console.log("Locations-codes read from DB successfully ", locationCodes);
        return locationCodes;
      }),
      catchError(error => {
        console.error("Error getting LocationCodes", error);
        return throwError(() => new Error('Error getting LocationCodes'));
      })
    );
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
