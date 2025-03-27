import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';

describe('HomeComponent (with CollapseDirective)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidebarCollapsed=true if window.innerWidth <= 1024', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);

    const newFixture = TestBed.createComponent(HomeComponent);
    const newComp = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComp.sidebarCollapsed).toBeTrue();
  });

  it('toggleSidebar() should set currentDropdown=null and invert sidebarCollapsed', () => {
    component.currentDropdown = 'proyectos';
    component.sidebarCollapsed = false;

    component.toggleSidebar();
    expect(component.currentDropdown).toBeNull();
    expect(component.sidebarCollapsed).toBeTrue();

    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeFalse();
  });

  it('onDropdownClick(...) should preventDefault and toggle currentDropdown', () => {
    const mockEvent = { preventDefault: jasmine.createSpy() } as any;

    expect(component.currentDropdown).toBeNull();
    component.onDropdownClick(mockEvent, 'proyectos');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.currentDropdown).toBe('proyectos');

    component.onDropdownClick(mockEvent, 'proyectos');
    expect(component.currentDropdown).toBeNull();
  });

  it('should close the "proyectos" dropdown by default', fakeAsync(() => {
    const ulElement = fixture.debugElement.query(By.css('.dropdown-menu-custom')).nativeElement;

    component.currentDropdown = 'proyectos';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.currentDropdown = null;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(ulElement.style.height).toBe('');
  }));
});
