import { TestBed } from '@angular/core/testing';
import { AuthRedirectGuard } from './auth-redirect.guard';
import { AuthService } from '@core/services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthRedirectGuard', () => {
  let guard: AuthRedirectGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'validateUserStorage',
      'isAuthenticated',
      'untilOperator',
      'untilStaff'
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthRedirectGuard,
        { provide: AuthService, useValue: aSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    guard = TestBed.inject(AuthRedirectGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is NOT authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(canActivate).toBeTrue();
  });

  it('should return false and navigate to /internal/dashboard/memberships if user is authenticated AND untilOperator is true', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.untilOperator.and.returnValue(true);

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/internal/dashboard/memberships']);
    expect(canActivate).toBeFalse();
  });

  it('should return false and navigate to /public/home/maintenance if user is authenticated, untilOperator false, but untilStaff is true', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.untilOperator.and.returnValue(false);
    authServiceSpy.untilStaff.and.returnValue(true);

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/home/maintenance']);
    expect(canActivate).toBeFalse();
  });

  it('should return false and navigate to /public/home/maintenance if user is authenticated but neither untilOperator nor untilStaff are true', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.untilOperator.and.returnValue(false);
    authServiceSpy.untilStaff.and.returnValue(false);

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/home/maintenance']);
    expect(canActivate).toBeFalse();
  });
});
