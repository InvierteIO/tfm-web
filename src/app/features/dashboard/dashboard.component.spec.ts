import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { SidebarService } from '../shared/services/siderbar.service';
import { MenuSidebar } from '../shared/models/menu-sidebar.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let sidebarServiceSpy: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SidebarService', ['getMenusDashboard']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: SidebarService, useValue: spy },        
        provideHttpClient(), 
        provideHttpClientTesting(),
      ] 
    }).compileComponents();

    sidebarServiceSpy = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set menus from SidebarService on ngOnInit', () => {
    const fakeMenus: MenuSidebar[] = [
      { title: 'Test Dashboard', id: 'test', url: '/dashboard/test' }
    ];
    sidebarServiceSpy.getMenusDashboard.and.returnValue(fakeMenus);
    component.ngOnInit();
    expect(component.menus).toEqual(fakeMenus);
    expect(sidebarServiceSpy.getMenusDashboard).toHaveBeenCalled();
  });
});
