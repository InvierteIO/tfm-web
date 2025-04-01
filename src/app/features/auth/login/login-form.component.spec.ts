import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '@core/services/auth.service';
import { UserType } from '@core/models/user-type.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import {User} from '@core/models/user.model';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: aSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component.userType = UserType.OPERATOR;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form creation & getters', () => {
    it('should create form with email & password', () => {
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
    });

    it('should detect isEmailNotValid if email is invalid & touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(component.isEmailNotValid).toBeTrue();
    });

    it('should detect isPasswordNotValid if password is invalid & touched', () => {
      const passControl = component.loginForm.get('password');
      passControl?.setValue('');
      passControl?.markAsTouched();

      expect(component.isPasswordNotValid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should mark form as touched and return if form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      spyOn(component.loginForm, 'markAllAsTouched');

      component.onSubmit();
      expect(component.loading).toBeFalse();
    });

    it('should call auth.login if form is valid and emit loginSuccess on success', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: 'secret' });
      const loginSuccessSpy = spyOn(component.loginSuccess, 'emit');
      authServiceSpy.login.and.returnValue(of({ token: 'xxx' } as any));

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'secret', UserType.OPERATOR);
      expect(component.loading).toBeFalse();
      expect(loginSuccessSpy).toHaveBeenCalled();
    });

    it('should handle error from auth.login (error callback)', () => {
      component.loginForm.setValue({ email: 'err@example.com', password: 'wrong' });
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should set loading false on complete callback as well', () => {
      component.loginForm.setValue({ email: 'test@example.com', password: 'test' });
      authServiceSpy.login.and.returnValue(of({} as User)); // un of vacío

      component.onSubmit();
      expect(component.loading).toBeFalse();
    });
  });

  describe('Extra output events', () => {
    it('should emit forgotPasswordSuccess when goForgotPassword is called', () => {
      const forgotSpy = spyOn(component.forgotPasswordSuccess, 'emit');
      component.goForgotPassword();
      expect(forgotSpy).toHaveBeenCalled();
    });

    it('should emit signUpSuccess when goSignUp is called', () => {
      const signUpSpy = spyOn(component.signUpSuccess, 'emit');
      component.goSignUp();
      expect(signUpSpy).toHaveBeenCalled();
    });
  });
});
