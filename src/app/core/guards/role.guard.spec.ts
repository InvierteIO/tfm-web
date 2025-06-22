import { TestBed } from '@angular/core/testing';
import { RoleGuardService } from './role.guard.service';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { Role } from '@core/models/role.model';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuardService', () => {
  let guard: RoleGuardService;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'validateUserStorage',
      'isAuthenticated',
      'hasRoles',
      'hasCompanyRoles'
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuardService,
        { provide: AuthService, useValue: aSpy },
        { provide: Router, useValue: rSpy },
      ]
    });

    guard = TestBed.inject(RoleGuardService);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return false and navigate if user is NOT authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    const routeSnapshot = new ActivatedRouteSnapshot();
    (routeSnapshot as any).data = { roles: [Role.ADMIN] };

    const canActivate = guard.canActivate(routeSnapshot);

    expect(authServiceSpy.validateUserStorage).toHaveBeenCalled();
    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    expect(canActivate).toBeFalse();
  });

  it('should return true if user is authenticated AND has roles', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.hasRoles.and.returnValue(true);
    authServiceSpy.hasCompanyRoles.and.returnValue(false);

    const routeSnapshot = new ActivatedRouteSnapshot();
    (routeSnapshot as any).data = { roles: [Role.ADMIN] };

    const canActivate = guard.canActivate(routeSnapshot);

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(canActivate).toBeTrue();
  });

  it('should return true if user is authenticated AND does NOT have normal roles but DOES have companyRoles', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.hasRoles.and.returnValue(false);
    authServiceSpy.hasCompanyRoles.and.returnValue(true);

    const routeSnapshot = new ActivatedRouteSnapshot();
    (routeSnapshot as any).data = { roles: [Role.ADMIN] };

    const canActivate = guard.canActivate(routeSnapshot);
    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should return false and navigate if user is authenticated but lacks both roles & companyRoles', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.hasRoles.and.returnValue(false);
    authServiceSpy.hasCompanyRoles.and.returnValue(false);

    const routeSnapshot = new ActivatedRouteSnapshot();
    (routeSnapshot as any).data = { roles: [Role.ADMIN] };

    const canActivate = guard.canActivate(routeSnapshot);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    expect(canActivate).toBeFalse();
  });
});
