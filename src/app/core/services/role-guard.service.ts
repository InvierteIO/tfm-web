import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';

import {AuthService} from '@core/services/auth.service';
import {Role} from '@core/models/role.model';


@Injectable({providedIn: 'root'})
export class RoleGuardService implements CanActivate {
    constructor(private readonly auth: AuthService, private readonly router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const roles: Role[] = route.data['roles'];
        
        this.auth.validateUserStorage();
              
        if (!this.auth.isAuthenticated()) {
          this.router.navigate(['']);
          return false;
        }
              
        if (this.auth.hasRoles(roles) || this.auth.hasCompanyRoles(roles)) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
    }

}
