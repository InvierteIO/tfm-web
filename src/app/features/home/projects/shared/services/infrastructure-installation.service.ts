import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {InfrastructureInstallationMock} from '../models/infrastructure-installation.mock';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from "@env";

@Injectable({
  providedIn: 'root'
})
export class InfrastructureInstallationService {

  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<InfrastructureInstallationMock[]> {
    const url = `${environment.REST_CORE}/infra-installations`;
    return this.httpService
    .error("Error obteniendo información de características de la habilitación")
    .get(url)
    .pipe(
      map((infraInstallations: InfrastructureInstallationMock[]) => {
        console.log("Infra-Installation read from DB successfully ", infraInstallations);
        return infraInstallations;
      }),
      catchError(error => {
        console.error("Error getting Infra-Installation", error);
        return throwError(() => new Error('Error getting Infra-Installation'));
      })
    );
  }

}
