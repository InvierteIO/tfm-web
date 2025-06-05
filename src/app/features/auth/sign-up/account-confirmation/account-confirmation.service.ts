import {Injectable} from '@angular/core';
import {HttpService} from "@core/services/http.service";
import {Observable, throwError} from "rxjs";
import { environment } from "@env";
import { catchError, map } from 'rxjs/operators';
import { AccountConfirmationDto } from '../models/account-confirmation-info.model';

@Injectable({
    providedIn: 'root'
})
export class AccountConfirmationService {

    static readonly END_POINT_ACTIVATE_CODE = environment.REST_USER + '/users/staff/activate-code';

    constructor(private readonly httpService: HttpService) {
    }

    activateStaffUser(token: string): Observable<AccountConfirmationDto> {
        const url = `${AccountConfirmationService.END_POINT_ACTIVATE_CODE}/${encodeURIComponent(token)}`;
        return this.httpService.post(url, {})
    }

}
