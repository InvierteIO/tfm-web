import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { SidebarService } from '../shared/services/siderbar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing'; // <-- Importar

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let sidebarServiceSpy: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const sSpy = jasmine.createSpyObj('SidebarService', ['getMenusDashboard']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: SidebarService, useValue: sSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    sidebarServiceSpy = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;

    sidebarServiceSpy.getMenusDashboard.and.returnValue([
      {
        title: 'Tablero',
        icon_google: 'apps',
        url: '/internal/dashboard/apps',
        id: 'apps'
      },
      {
        title: 'Mantenimientos',
        icon_google: 'settings',
        id: 'settings',
        submenus: [
          { title: 'Membresias', url: '/internal/dashboard/memberships' },
          { title: 'Empresas inmobiliarias', url: '/internal/dashboard/companies' }
        ]
      }
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set menus from sidebarService', () => {
      expect(sidebarServiceSpy.getMenusDashboard).toHaveBeenCalled();
      expect(component.menus.length).toBe(2);
      expect(component.menus[0].title).toBe('Tablero');
    });
  });
});
