import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpService} from '@core/services/http.service';
import { User } from '@core/models/user.model';
import { environment } from '@env';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Role } from '@core/models/role.model';
import { UserType } from '@core/models/user-type.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    static readonly END_POINT_OPERATOR = environment.REST_USER + '/users/operator/token';
    static readonly END_POINT_STAFF = environment.REST_USER + '/users/staff/token';
    private user: User | undefined = undefined;

    constructor(private readonly router: Router, 
        private readonly httpService : HttpService) {
    }

    login(email: string, password: string, userType: UserType): Observable<User> {

        return this.httpService.authBasic(email, password)
            .post(UserType.OPERATOR == userType? AuthService.END_POINT_OPERATOR : AuthService.END_POINT_STAFF)
            .pipe(
                map(jsonToken => {
                    const jwtHelper = new JwtHelperService();
                    const decodedToken = jwtHelper.decodeToken(jsonToken.token);

                    const companyRoles = Object.entries(decodedToken.companyRoles || {}).map(([key, value]) => ({
                        taxIdentificationNumber: key,
                        role: value as Role
                    }));

                    this.user = {
                        token: jsonToken.token,
                        email: decodedToken.user,
                        name: decodedToken.name,
                        role: decodedToken.role,
                        companyRoles: companyRoles
                    };               
                    return this.user;
                })
            ); 
    }

    logout(): void {
        this.user = undefined as any;
        this.router.navigate(['']).then();
    }

    getToken(): string |undefined {
        return this.user ? this.user.token : undefined;
    }

    isAuthenticated(): boolean {
        return this.user != null && !(new JwtHelperService().isTokenExpired(this.user.token));
    }

    getName(): string {
        return this.user ? this.user.name! : '???';
    }

    untilOperator(): boolean {
        return this.hasRoles([Role.ADMIN, Role.SUPPORT]);
    }

    untilStaff(): boolean {
        return this.hasCompanyRoles([Role.OWNER, Role.AGENT]);
    }

    hasRoles(roles: Role[]): boolean {
        if (!this.user || !this.user.role) return false;
        return this.isAuthenticated() && roles.includes(this.user.role);
    }

    hasCompanyRoles(roles: Role[]): boolean {
        if (!this.user || !this.user.companyRoles) return false;
        return this.isAuthenticated() && roles.some(role => 
            this.user?.companyRoles.some(companyRole => companyRole.role === role));
    }

}
