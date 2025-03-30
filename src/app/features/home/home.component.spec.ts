import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SidebarService } from '../shared/services/siderbar.service';
import { MenuSidebar } from '../shared/models/menu-sidebar.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let sidebarServiceSpy: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SidebarService', ['getMenusHome']);
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: SidebarService, useValue: spy },
        provideHttpClient(), 
        provideHttpClientTesting(),
      ]         
    }).compileComponents();

    sidebarServiceSpy = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set menus from SidebarService on ngOnInit', () => {
    const fakeMenus: MenuSidebar[] = [
      { title: 'Test Home', id: 'test', url: '/home/test' }
    ];
    sidebarServiceSpy.getMenusHome.and.returnValue(fakeMenus);
    component.ngOnInit();
    expect(component.menus).toEqual(fakeMenus);
    expect(sidebarServiceSpy.getMenusHome).toHaveBeenCalled();
  });
});
