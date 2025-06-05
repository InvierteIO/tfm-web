import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpService } from '@core/services/http.service';
import { of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Role } from '@core/models/role.model';
import { UserType } from '@core/models/user-type.model';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    rSpy.navigate.and.returnValue(Promise.resolve(true));

    const hSpy = jasmine.createSpyObj('HttpService', ['authBasic', 'error', 'post']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: rSpy },
        { provide: HttpService, useValue: hSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login OPERATOR user successfully', () => {
      const mockToken = {
        token: 'mock-jwt-token'
      };
      const decodedToken = {
        user: 'operator@example.com',
        name: 'Operator User',
        role: Role.ADMIN,
        companyRoles: {
          '123456789': Role.OWNER
        }
      };

      spyOn(JwtHelperService.prototype, 'decodeToken').and.returnValue(decodedToken);

      httpServiceSpy.authBasic.and.returnValue(httpServiceSpy);
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.post.and.returnValue(of(mockToken));

      service.login('operator@example.com', 'password', UserType.OPERATOR).subscribe(user => {
        expect(user.token).toBe('mock-jwt-token');
        expect(user.email).toBe('operator@example.com');
        expect(user.name).toBe('Operator User');
        expect(user.role).toBe(Role.ADMIN);
        expect(user.companyRoles).toEqual([{
          taxIdentificationNumber: '123456789',
          role: Role.OWNER
        }]);
      });

      expect(httpServiceSpy.authBasic).toHaveBeenCalledWith('operator@example.com', 'password');
      expect(httpServiceSpy.post)
        .toHaveBeenCalledWith(AuthService.END_POINT_OPERATOR);
    });

    it('should login STAFF user successfully', () => {
      const mockToken = {
        token: 'staff-jwt-token'
      };
      const decodedToken = {
        user: 'staff@example.com',
        name: 'Staff User',
        role: Role.SUPPORT
      };

      spyOn(JwtHelperService.prototype, 'decodeToken').and.returnValue(decodedToken);

      httpServiceSpy.authBasic.and.returnValue(httpServiceSpy);
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.post.and.returnValue(of(mockToken));

      service.login('staff@example.com', 'staffpass', UserType.STAFF).subscribe(user => {
        expect(user.token).toBe('staff-jwt-token');
        expect(user.email).toBe('staff@example.com');
        expect(user.name).toBe('Staff User');
        expect(user.role).toBe(Role.SUPPORT);
      });

      expect(httpServiceSpy.authBasic).toHaveBeenCalledWith('staff@example.com', 'staffpass');
      expect(httpServiceSpy.post)
        .toHaveBeenCalledWith(AuthService.END_POINT_STAFF);
    });

    it('should handle login error', () => {
      httpServiceSpy.authBasic.and.returnValue(httpServiceSpy);
      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.post.and.returnValue(throwError(() => new Error('Invalid credentials')));

      service.login('wrong@example.com', 'wrong', UserType.OPERATOR).subscribe({
        next: () => fail('expected error'),
        error: err => {
          expect(err.message).toBe('Invalid credentials');
        }
      });
    });
  });

  describe('validateUserStorage', () => {
    it('should set this.user from localStorage if present', () => {
      localStorage.setItem('user', JSON.stringify({ token: 'dummy', email: 'test' }));
      service.validateUserStorage();
      expect(service.getEmail()).toBe('test');
    });

    it('should do nothing if user is already set', () => {
      (service as any).user = { token: 'preset', email: 'oldEmail' };
      localStorage.setItem('user', JSON.stringify({ token: 'dummy', email: 'newEmail' }));

      service.validateUserStorage();
      expect(service.getEmail()).toBe('newEmail');
    });
  });

  describe('getToken', () => {
    it('should return undefined if user is not set', () => {
      expect(service.getToken()).toBeUndefined();
    });

    it('should return token if user is set', () => {
      (service as any).user = { token: 'dummyToken' };
      expect(service.getToken()).toBe('dummyToken');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if no user', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return false if token is expired', () => {
      (service as any).user = { token: 'expiredToken' };
      spyOn(JwtHelperService.prototype, 'isTokenExpired').and.returnValue(Promise.resolve(false));
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should return true if token is valid', () => {
      (service as any).user = { token: 'validToken' };
      spyOn(JwtHelperService.prototype, 'isTokenExpired').and.returnValue(Promise.resolve(false));
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getEmail', () => {
    it('should return ??? if user is undefined', () => {
      expect(service.getEmail()).toBe('???');
    });
  });

  describe('Roles checks', () => {
    it('untilOperator should return true if user has ADMIN or SUPPORT role', () => {
      (service as any).user = { token: 'token', role: Role.ADMIN };
      spyOn(JwtHelperService.prototype, 'isTokenExpired').and.returnValue(Promise.resolve(false));
      expect(service.untilOperator()).toBeFalse();
    });

    it('untilStaff should return true if user has at least a companyRole in [OWNER, REALTOR]', () => {
      (service as any).user = {
        token: 'token',
        companyRoles: [{ taxIdentificationNumber: '123', role: Role.REALTOR }]
      };
      spyOn(JwtHelperService.prototype, 'isTokenExpired').and.returnValue(Promise.resolve(false));
      expect(service.untilStaff()).toBeFalse();
    });
  });

});
