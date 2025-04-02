import {Injectable} from '@angular/core';
import {HttpService} from "@core/services/http.service";
import {Observable} from "rxjs";
import { environment } from "@env";
import {Staff} from "@core/models/staff.model"
import {UserCompany} from "../models/user-company.model"
import {Company} from "@core/models/company.model"


@Injectable({
    providedIn: 'root'
})
export class AccountConfigurationService {

    static readonly END_POINT_USER_STAFF = environment.REST_USER + '/users/staff';
    static readonly END_POINT_USER_NO_COMPANY = AccountConfigurationService.END_POINT_USER_STAFF + '/no-company';
    static readonly END_POINT_COMPANY = environment.REST_CORE + '/real-state-companies';

    constructor(private readonly httpService: HttpService) {
    }

    addStaffUserNoCompany(staff: Staff): Observable<void> {
        return this.httpService.post(AccountConfigurationService.END_POINT_USER_NO_COMPANY, staff);
    }

    addCompany(company: Company): Observable<void> {
        return this.httpService.post(AccountConfigurationService.END_POINT_COMPANY, company);
    }

    setUserCompany(email: string, userCompany: UserCompany): Observable<void> {
        const url = `${AccountConfigurationService.END_POINT_USER_STAFF}/${encodeURIComponent(email)}/set-company`;
        return this.httpService.patch(url, userCompany);
    }

    notifyActivationCode(email: string, taxIdentificationNumber: string): Observable<void> {
        const url = `${AccountConfigurationService.END_POINT_USER_STAFF}/${encodeURIComponent(email)}/companies/${encodeURIComponent(taxIdentificationNumber)}/notify-code`;
        return this.httpService.post(url);
    }

}
