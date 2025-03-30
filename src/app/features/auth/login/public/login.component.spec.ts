import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { LoginComponent } from './login.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let consoleLogSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [              
        provideHttpClient(), 
        provideHttpClientTesting(),
      ] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    consoleLogSpy = spyOn(console, 'log');
  });

  it('should create the component and its form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm instanceof FormGroup).toBeTrue();
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  describe('onSubmit method', () => {
    it('should log "Formulario inválido" and mark controls as touched when the form is invalid', () => {
      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(consoleLogSpy).toHaveBeenCalledWith('Formulario inválido');
      expect(component.loginForm.get('email')?.touched).toBeTrue();
      expect(component.loginForm.get('password')?.touched).toBeTrue();
    });

    it('should iterate over nested controls and mark them as touched', () => {
      const nestedGroup = new FormGroup({
        nestedControl: new FormControl('')
      });
      component.loginForm.addControl('nested', nestedGroup);

      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');

      component.onSubmit();

      expect(nestedGroup.get('nestedControl')?.touched).toBeTrue();
    });
  });

  describe('Getters', () => {
    it('getter emailNotValid should return true when email is invalid and touched', () => {
      component.loginForm.get('email')?.setValue('invalid');
      component.loginForm.get('email')?.markAsTouched();
      expect(component.isEmailNotValid).toBeTrue();
    });

    it('getter emailNotValid should return false when email is valid or not touched', () => {
      component.loginForm.get('email')?.setValue('test@example.com');
      expect(component.isEmailNotValid).toBeFalse();
      component.loginForm.get('email')?.markAsTouched();
      expect(component.isEmailNotValid).toBeFalse();
    });

    it('getter passwordNotValid should return true when password is empty and touched', () => {
      component.loginForm.get('password')?.setValue('');
      component.loginForm.get('password')?.markAsTouched();
      expect(component.isPasswordNotValid).toBeTrue();
    });

    it('getter passwordNotValid should return false when password has a value or is not touched', () => {
      component.loginForm.get('password')?.setValue('123456');
      expect(component.isPasswordNotValid).toBeFalse();
      component.loginForm.get('password')?.markAsTouched();
      expect(component.isPasswordNotValid).toBeFalse();
    });
  });
});
