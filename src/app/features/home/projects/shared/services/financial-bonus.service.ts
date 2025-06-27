import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, throwError, of} from "rxjs";
import {FinancialBonusMock} from '../models/financial-bonus.mock';
import { catchError, concatMap, finalize, map } from 'rxjs/operators';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class FinancialBonusService {

  constructor(private readonly httpService: HttpService) {
  }

  readAll(): Observable<FinancialBonusMock[]> {
    const url = `${environment.REST_CORE}/financial-bonuses`;
    return this.httpService
    .error("Error obteniendo Bonos Financieros")
    .get(url)
    .pipe(
      map((financialBonuses: FinancialBonusMock[]) => {
        console.log("FinancialBonus read from DB successfully", financialBonuses);
        return financialBonuses;
      }),
      catchError(error => {
        console.error("Error getting FinancialBonus", error);
        return throwError(() => new Error('Error getting FinancialBonus'));
      })
    );
  }

}
