import { TestBed } from '@angular/core/testing';
import { ChangePasswordService } from './change-password.service';
import { HttpService } from '@core/services/http.service';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError, EMPTY } from 'rxjs';
import { EndPoints } from '@core/end-points';
import { PasswordChange } from '../models/password-change.model';
import Swal, {SweetAlertResult} from 'sweetalert2';

describe('ChangePasswordService', () => {
  let service: ChangePasswordService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const hSpy = jasmine.createSpyObj('HttpService', ['error', 'successful', 'patch']);
    const aSpy = jasmine.createSpyObj('AuthService', [
      'untilOperator', 'untilStaff'
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ChangePasswordService,
        { provide: HttpService, useValue: hSpy },
        { provide: AuthService, useValue: aSpy },
        { provide: Router, useValue: rSpy },
      ]
    });

    service = TestBed.inject(ChangePasswordService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updatePassword', () => {
    it('should return EMPTY if userType is undefined (neither operator nor staff)', () => {
      authServiceSpy.untilOperator.and.returnValue(false);
      authServiceSpy.untilStaff.and.returnValue(false);

      const swalSpy = spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({
          isConfirmed: false,
          isDenied: false,
          isDismissed: true,
        } as SweetAlertResult<any>)
      );

      const result = service.updatePassword('test@example.com', {
        password: 'old',
        newPassword: 'new'
      });

      expect(swalSpy).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/public/auth/login']);

      expect(result).toBe(EMPTY);
      expect(httpServiceSpy.patch).not.toHaveBeenCalled();
    });

    it('should patch with userType=operator if untilOperator is true', () => {
      authServiceSpy.untilOperator.and.returnValue(true);
      authServiceSpy.untilStaff.and.returnValue(false);

      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(of(undefined));

      const passChange: PasswordChange = { password: 'oldPass', newPassword: 'newPass' };
      service.updatePassword('test@example.com', passChange).subscribe(result => {
        expect(result).toBeUndefined();
      });

      expect(httpServiceSpy.patch).toHaveBeenCalledWith(
        `${EndPoints.USERS}/operator/test%40example.com/change-password`,
        passChange
      );
    });

    it('should patch with userType=staff if untilOperator is false but untilStaff is true', () => {
      authServiceSpy.untilOperator.and.returnValue(false);
      authServiceSpy.untilStaff.and.returnValue(true);

      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(of(undefined));

      const passChange: PasswordChange = { password: 'old', newPassword: 'new' };
      service.updatePassword('staff@example.com', passChange).subscribe();

      expect(httpServiceSpy.patch).toHaveBeenCalledWith(
        `${EndPoints.USERS}/staff/staff%40example.com/change-password`,
        passChange
      );
    });

    it('should handle error from patch', () => {
      authServiceSpy.untilOperator.and.returnValue(true);
      authServiceSpy.untilStaff.and.returnValue(false);

      httpServiceSpy.error.and.returnValue(httpServiceSpy);
      httpServiceSpy.successful.and.returnValue(httpServiceSpy);
      httpServiceSpy.patch.and.returnValue(throwError(() => new Error('Patch Error')));

      const passChange: PasswordChange = { password: 'x', newPassword: 'y' };
      service.updatePassword('test@example.com', passChange).subscribe({
        next: () => fail('expected error'),
        error: err => {
          expect(err.message).toBe('Patch Error');
        }
      });
    });
  });
});
