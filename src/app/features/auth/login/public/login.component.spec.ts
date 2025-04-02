import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /public/home/maintenance on login success', () => {
    component.onLoginSuccess();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/home/maintenance']);
  });

  it('should navigate to /public/auth/signup/register-info on onSignUp', () => {
    component.onSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/auth/signup/register-info']);
  });

  it('should navigate to /public/auth/forgot-password on onForgotPassword', () => {
    component.onForgotPassword();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/auth/forgot-password']);
  });
});
