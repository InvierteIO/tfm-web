import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import Swal from 'sweetalert2';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    rSpy.navigate.and.returnValue(Promise.resolve(true));

    const aSpy = jasmine.createSpyObj('AuthService', ['untilOperator', 'logout']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: rSpy },
        { provide: AuthService, useValue: aSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goProfile', () => {
    it('should navigate to /internal/dashboard/profile if user is operator', () => {
      authServiceSpy.untilOperator.and.returnValue(true);
      component.goProfile();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/internal/dashboard/profile']);
    });

    it('should navigate to /public/home/profile if user is NOT operator', () => {
      authServiceSpy.untilOperator.and.returnValue(false);
      component.goProfile();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/home/profile']);
    });
  });

  describe('logoutShort', () => {
    beforeEach(() => {
      // Default: SweetAlert "fire" devuelva algo
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
    });

    it('should NOT logout if user cancels in SweetAlert', fakeAsync(() => {
      (Swal.fire as jasmine.Spy).and.returnValue(
        Promise.resolve({ isConfirmed: false } as any)
      );

      component.logout();
      tick();

      expect(authServiceSpy.logout).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));

    it('should logout and navigate to /internal/auth/login if user confirms and is operator', fakeAsync(() => {
      authServiceSpy.untilOperator.and.returnValue(true);

      component.logout();
      tick();

      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/internal/auth/login']);
    }));

    it('should logout and navigate to /public/auth/login if user confirms and is not operator', fakeAsync(() => {
      authServiceSpy.untilOperator.and.returnValue(false);

      component.logout();
      tick();

      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/public/auth/login']);
    }));
  });
});
