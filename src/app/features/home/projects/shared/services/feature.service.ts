import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {FeatureMock} from '../models/feature.mock.model';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<FeatureMock[]> {
    const url = `${environment.REST_CORE}/features`;
    return this.httpService
    .error("Error obteniendo información de caracteristica de tipo de propiedad")
    .get(url)
    .pipe(
      map((features: FeatureMock[]) => {
        console.log("Features read from DB successfully");
        return features;
      }),
      catchError(error => {
        console.error("Error getting Features", error);
        return throwError(() => new Error('Error getting features'));
      })
    );
  }



}
