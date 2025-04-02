import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '@core/services/auth.service';
import { ChangePasswordService } from '../../services/change-password.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { PasswordChange } from '../../models/password-change.model';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let changePasswordServiceSpy: jasmine.SpyObj<ChangePasswordService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getEmail']);
    const cpSpy = jasmine.createSpyObj('ChangePasswordService', ['updatePassword']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ChangePasswordComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: ChangePasswordService, useValue: cpSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    changePasswordServiceSpy = TestBed.inject(ChangePasswordService) as jasmine.SpyObj<ChangePasswordService>;

    authServiceSpy.getEmail.and.returnValue('test@example.com');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set emailSession with authService.getEmail()', () => {
      component.ngOnInit();
      expect(authServiceSpy.getEmail).toHaveBeenCalled();
      expect(component.emailSession).toBe('test@example.com');
    });
  });

  describe('createForm', () => {
    it('should create the form with oldpassword, password and repeatedpwd', () => {
      const form = component.createForm();
      expect(form.get('oldpassword')).toBeTruthy();
      expect(form.get('password')).toBeTruthy();
      expect(form.get('repeatedpwd')).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should mark form as touched and return if form is invalid', () => {
      spyOn(component.form, 'markAllAsTouched');

      component.form.setValue({
        oldpassword: '',
        password: '',
        repeatedpwd: ''
      });

      component.onSubmit();
      expect(component.form.markAllAsTouched).not.toHaveBeenCalled();
      expect(changePasswordServiceSpy.updatePassword).not.toHaveBeenCalled();
    });

    it('should show SweetAlert and call changePasswordService.updatePassword on confirm', fakeAsync(() => {
      component.form.setValue({
        oldpassword: 'old123',
        password: 'new123',
        repeatedpwd: 'new123'
      });

      const swalSpy = spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      changePasswordServiceSpy.updatePassword.and.returnValue(of(undefined));

      component.onSubmit();
      tick();

      expect(swalSpy).toHaveBeenCalled();
      expect(changePasswordServiceSpy.updatePassword).toHaveBeenCalledWith(
        'test@example.com',
        { password: 'old123', newPassword: 'new123' } as PasswordChange
      );
      expect(component.loading).toBeFalse();
    }));

    it('should NOT call updatePassword if user cancels in Swal', fakeAsync(() => {
      component.form.setValue({
        oldpassword: 'old123',
        password: 'new123',
        repeatedpwd: 'new123'
      });

      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false } as any)
      );

      component.onSubmit();
      tick();
      expect(changePasswordServiceSpy.updatePassword).not.toHaveBeenCalled();
    }));

    it('should handle error in updatePassword', fakeAsync(() => {
      component.form.setValue({
        oldpassword: 'old123',
        password: 'new123',
        repeatedpwd: 'new123'
      });

      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );

      changePasswordServiceSpy.updatePassword.and.returnValue(
        throwError(() => new Error('Update error'))
      );

      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
    }));
  });

  describe('Getters', () => {
    it('should detect isOldPasswordNotValid properly', () => {
      component.form.get('oldpassword')?.setValue('');
      component.form.get('oldpassword')?.markAsTouched();

      expect(component.isOldPasswordNotValid).toBeTrue();
    });

    it('should detect isPasswordNotValid properly', () => {
      component.form.get('password')?.setValue('');
      component.form.get('password')?.markAsTouched();

      expect(component.isPasswordNotValid).toBeTrue();
    });

    it('should detect isRepeatedpwdNotValid if password != repeatedpwd', () => {
      component.form.setValue({
        oldpassword: 'x',
        password: 'abc',
        repeatedpwd: 'xyz'
      });
      expect(component.isRepeatedpwdNotValid).toBeTrue();
      component.form.get('repeatedpwd')?.setValue('abc');
      expect(component.isRepeatedpwdNotValid).toBeFalse();
    });
  });
});
