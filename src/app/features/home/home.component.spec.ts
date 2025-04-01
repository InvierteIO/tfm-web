import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SidebarService } from '../shared/services/siderbar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let sidebarServiceSpy: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const sSpy = jasmine.createSpyObj('SidebarService', ['getMenusHome']);

    await TestBed.configureTestingModule({

      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: SidebarService, useValue: sSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    sidebarServiceSpy = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;

    sidebarServiceSpy.getMenusHome.and.returnValue([
      {
        title: 'Tablero',
        icon_google: 'apps',
        url: '/public/home/apps',
        id: 'apps'
      },
      {
        title: 'Otras opciones',
        icon_google: 'settings',
        id: 'settings',
        submenus: [
          { title: 'Opción 1', url: '/public/home/option1' },
          { title: 'Opción 2', url: '/public/home/option2' }
        ]
      }
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call sidebarService.getMenusHome and store in menus', () => {
      expect(sidebarServiceSpy.getMenusHome).toHaveBeenCalled();
      expect(component.menus.length).toBe(2);
      expect(component.menus[0].title).toBe('Tablero');
    });
  });

  it('should have an empty menus array before ngOnInit', () => {
    const newFixture = TestBed.createComponent(HomeComponent);
    const newComp = newFixture.componentInstance;
    expect(newComp.menus).toEqual([]);
  });
});
