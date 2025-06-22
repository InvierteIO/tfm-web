import {Injectable} from '@angular/core';
import {HttpService} from "@core/services/http.service";
import {Observable, throwError} from "rxjs";
import { environment } from "@env";
import { catchError, map } from 'rxjs/operators';
import { Staff } from '@core/models/staff.model';

@Injectable({
    providedIn: 'root'
})
export class UserManagementService {

    static readonly END_POINT_USER_STAFF = environment.REST_USER + '/users/staff';

    static readonly END_POINT_CREATE_STAFF_USER = environment.REST_USER + '/users/staff/companies';

    constructor(private readonly httpService: HttpService) {
    }

    createStaffUser(staff: Staff): Observable<void> {

        if (!staff.taxIdentificationNumber) {
            throw new Error('Tax Identification Number is required');
        }

        const url = `${UserManagementService.END_POINT_CREATE_STAFF_USER}/${encodeURIComponent(staff.taxIdentificationNumber)}`;
        return this.httpService
        .error("Error creando nuevo usuario")
        .post(url, staff)
        .pipe(
          map(() => {
            console.log("User created successfully");
          }),
          catchError(error => {
            console.error("create user failed", error);
            return throwError(() => new Error('Create user failed'));
          })
        );
    }


    notifyActivationCode(email: string, taxIdentificationNumber: string): Observable<void> {
        const url = `${UserManagementService.END_POINT_USER_STAFF}/${encodeURIComponent(email)}/companies/${encodeURIComponent(taxIdentificationNumber)}/notify-code`;
        return this.httpService
        .error("Error al enviar enlace de activación a usuario.")
        .successful("Se ha enviado enlace de activación de cuenta al usuario")
        .post(url);
    }

}
