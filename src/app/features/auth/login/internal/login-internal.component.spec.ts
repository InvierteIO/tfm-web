import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginInternalComponent } from './login-internal.component';
import { Router } from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginInternalComponent', () => {
  let component: LoginInternalComponent;
  let fixture: ComponentFixture<LoginInternalComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let router: Router;

  beforeEach(async () => {
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginInternalComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginInternalComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /internal/dashboard/memberships on onLoginSuccess', () => {
    component.onLoginSuccess();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/internal/dashboard/memberships']);
  });

  it('should navigate to /internal/auth/forgot-password on onForgotPassword', () => {
    component.onForgotPassword();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/internal/auth/forgot-password']);
  });
});
