import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {BankMock} from '../models/bank.mock.model';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from "@env";

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<BankMock[]> {
    const url = `${environment.REST_CORE}/banks`;
    return this.httpService
    .error("Error obteniendo información de bancos")
    .get(url)
    .pipe(
      map((banks: BankMock[]) => {
        console.log("Banks read from DB successfully ", banks);
        return banks;
      }),
      catchError(error => {
        console.error("Error getting Banks", error);
        return throwError(() => new Error('Error getting Banks'));
      })
    );
  }

}
