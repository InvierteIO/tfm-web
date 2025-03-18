import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import {HttpService} from '@core/services/http.service';
import { User } from '@core/models/user.model';
import { environment } from '@env';


@Injectable({providedIn: 'root'})
export class AuthService {
    static readonly END_POINT = environment.REST_USER + '/users';
    private user: User | undefined;

    constructor(private readonly router: Router, 
        private readonly httpService : HttpService) {
    }

    login(mobile: number, password: string): Observable<User> {
        return this.httpService.authBasic(mobile, password)
            .post(AuthService.END_POINT);
    }

    logout(): void {
        this.user = undefined;
        this.router.navigate(['']).then();
    }

    getToken(): string |undefined {
        return this.user ? this.user.token : undefined;
    }

    listUser(): Observable<User[]> {
        return this.httpService.get(AuthService.END_POINT);        
    }

}
