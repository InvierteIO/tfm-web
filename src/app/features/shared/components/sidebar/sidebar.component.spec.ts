import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { MenuSidebar } from '../../models/menu-sidebar.model';

import { Component } from '@angular/core';
@Component({ template: `<h2>Dummy</h2>`, standalone: true })
class DummyComponent {}

describe('SidebarComponent (standalone)', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
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
        provideHttpClient(), 
        provideHttpClientTesting(),
      ] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;

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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidebarCollapsed = true when window.innerWidth <= 1024', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
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
    btn.triggerEventHandler('click', null);

    expect(component.toggleSidebar).toHaveBeenCalled();
  });


  it('should apply CollapseDirective to dropdown menu and toggle its height', fakeAsync(() => {
    let dropdownEls = fixture.debugElement.queryAll(By.css('.dropdown-menu-custom'));
    expect(dropdownEls.length).toBeGreaterThan(0);

    const dropdownToggle = fixture.debugElement.query(By.css('.dropdown-toggle-custom'));
    dropdownToggle.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    tick();

    dropdownToggle.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    tick();
  }));
});
