import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthRedirectGuard implements CanActivate {

  constructor(private readonly  authService: AuthService, private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {    
    this.authService.validateUserStorage();    
    if (this.authService.isAuthenticated()) {      
      if (this.authService.untilOperator()) {
        this.router.navigate(['/internal/dashboard/memberships']);
      } else if (this.authService.untilStaff()) {
        this.router.navigate(['/public/home/maintenance']);
      } else {
        this.router.navigate(['/public/home/maintenance']);
      }
      return false;
    }    
    return true;
  }
}
