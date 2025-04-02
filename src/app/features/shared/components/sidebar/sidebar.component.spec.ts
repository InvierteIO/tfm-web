import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MenuSidebar } from '../../models/menu-sidebar.model';
import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({ template: `<h2>Dummy</h2>`, standalone: true })
class DummyComponent {}

describe('SidebarComponent (standalone)', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const aSpy = jasmine.createSpyObj('AuthService', [
      'getName',
      'untilOperator',
      'logout'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        RouterTestingModule.withRoutes([
          { path: 'menu1', component: DummyComponent },
          { path: 'menu2/sub1', component: DummyComponent },
          { path: '**', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useValue: aSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    authServiceSpy.getName.and.returnValue('TestUser');
    authServiceSpy.untilOperator.and.returnValue(false);

    component.menus = [
      {
        id: 'menu1',
        title: 'Menu 1',
        url: '/menu1',
      },
      {
        id: 'menu2',
        title: 'Menu 2',
        submenus: [
          { title: 'Submenu 1', url: '/menu2/sub1' },
          { title: 'Submenu 2', url: '/menu2/sub2' },
        ],
      }
    ];

    fixture.detectChanges(); // Llama ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidebarCollapsed = true when window.innerWidth <= 1024', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component.ngOnInit();
    expect(component.sidebarCollapsed).toBeTrue();
  });

  it('should keep sidebarCollapsed = false if window.innerWidth > 1024', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    component.ngOnInit();
    expect(component.sidebarCollapsed).toBeTrue();
  });

  it('isOpen should return true if currentDropdown equals given dropdownId', () => {
    component.currentDropdown = 'menu2';
    expect(component.isOpen('menu2')).toBeTrue();
    expect(component.isOpen('menu1')).toBeFalse();
  });

  it('should toggle currentDropdown between null and dropdownId when onDropdownClick is called', () => {
    const mockEvent = new MouseEvent('click');
    component.onDropdownClick(mockEvent, 'menu2');
    expect(component.currentDropdown).toBe('menu2');

    component.onDropdownClick(mockEvent, 'menu2');
    expect(component.currentDropdown).toBeNull();
  });

  it('should toggle sidebarCollapsed and reset currentDropdown', () => {
    component.currentDropdown = 'menu2';
    component.sidebarCollapsed = false;

    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeTrue();
    expect(component.currentDropdown).toBeNull();

    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeFalse();
  });

  it('should return true if menu.url matches the current router url (no submenus)', () => {
    spyOnProperty(component.router, 'url', 'get').and.returnValue('/menu1');
    const menu: MenuSidebar = { id: 'm1', title: 'Menu 1', url: '/menu1' };
    expect(component.isMenuActive(menu)).toBeTrue();
  });

  it('should return false if menu.url does not match current router.url (no submenus)', () => {
    spyOnProperty(component.router, 'url', 'get').and.returnValue('/others');
    const menu: MenuSidebar = { id: 'm1', title: 'Menu 1', url: '/menu1' };
    expect(component.isMenuActive(menu)).toBeFalse();
  });

  it('should return true if any submenu url matches the current router url', () => {
    spyOnProperty(component.router, 'url', 'get').and.returnValue('/menu2/sub1');
    const menu: MenuSidebar = {
      id: 'menu2',
      title: 'Menu 2',
      submenus: [
        { title: 'Submenu 1', url: '/menu2/sub1' },
        { title: 'Submenu 2', url: '/menu2/sub2' },
      ],
    };
    expect(component.isMenuActive(menu)).toBeTrue();
  });

  it('should return false if none of the submenu urls match the current router url', () => {
    spyOnProperty(component.router, 'url', 'get').and.returnValue('/something/else');
    const menu: MenuSidebar = {
      id: 'menu2',
      title: 'Menu 2',
      submenus: [
        { title: 'Submenu 1', url: '/menu2/sub1' },
        { title: 'Submenu 2', url: '/menu2/sub2' },
      ],
    };
    expect(component.isMenuActive(menu)).toBeFalse();
  });

  it('should call toggleSidebar() when the .sidebar-menu-button is clicked', () => {
    spyOn(component, 'toggleSidebar');
    const btn = fixture.debugElement.query(By.css('.sidebar-menu-button'));
    if (btn) {
      btn.triggerEventHandler('click', null);
      expect(component.toggleSidebar).toHaveBeenCalled();
    } else {
      fail('No .sidebar-menu-button found in template');
    }
  });

  it('should return name from AuthService', () => {
    authServiceSpy.getName.and.returnValue('SidebarUser');
    expect(component.name).toBe('SidebarUser');
    expect(authServiceSpy.getName).toHaveBeenCalled();
  });

  it('should return /internal/dashboard/profile if user is operator (untilOperator = true)', () => {
    authServiceSpy.untilOperator.and.returnValue(true);
    expect(component.linkProfile).toBe('/internal/dashboard/profile');
  });

  it('should return /public/home/profile if user is not operator', () => {
    authServiceSpy.untilOperator.and.returnValue(false);
    expect(component.linkProfile).toBe('/public/home/profile');
  });

  describe('logout', () => {
    it('should NOT logout if user cancels in SweetAlert', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false } as any)
      );
      const routerSpy = spyOn(router, 'navigate');

      component.logout();
      tick();

      expect(authServiceSpy.logout).not.toHaveBeenCalled();
      expect(routerSpy).not.toHaveBeenCalled();
    }));

    it('should logout and navigate to /internal/auth/login if user confirms and is operator', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      authServiceSpy.untilOperator.and.returnValue(true);
      const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      component.logout();
      tick();

      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/internal/auth/login']);
    }));

    it('should logout and navigate to /public/auth/login if user confirms and is not operator', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true } as any)
      );
      authServiceSpy.untilOperator.and.returnValue(false);
      const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      component.logout();
      tick();

      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/public/auth/login']);
    }));
  });
});
