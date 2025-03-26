import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginInternalComponent } from './login-internal.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginInternalComponent', () => {
  let component: LoginInternalComponent;
  let fixture: ComponentFixture<LoginInternalComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginInternalComponent,
        RouterTestingModule.withRoutes([])
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginInternalComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should initialize the form with empty values and loading set to false', () => {
    const formValues = component.loginForm.value;
    expect(formValues.email).toEqual('');
    expect(formValues.password).toEqual('');
    expect(component.loading).toBeFalse();
  });

  describe('isEmailNotValid getter', () => {
    it('should return true when email control is invalid and touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email'); // formato incorrecto
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isEmailNotValid).toBeTrue();
    });

    it('should return false when email control is valid and touched', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@example.com'); // formato correcto
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isEmailNotValid).toBeFalse();
    });
  });

  describe('isPasswordNotValid getter', () => {
    it('should return true when password control is invalid and touched', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isPasswordNotValid).toBeTrue();
    });

    it('should return false when password control is valid and touched', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('validPassword');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isPasswordNotValid).toBeFalse();
    });
  });

  describe('onSubmit', () => {

    it('should navigate to /internal/dashboard if the form is valid', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      component.loginForm.get('password')?.setValue('validPassword');
      spyOn(router, 'navigate');

      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/internal/dashboard']);
    });
  });
});
