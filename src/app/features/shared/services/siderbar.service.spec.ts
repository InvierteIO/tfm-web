import { TestBed } from '@angular/core/testing';
import { SidebarService } from './siderbar.service';
import { MenuSidebar } from '../models/menu-sidebar.model';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarService]
    });
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMenusHome', () => {
    it('should return the expected home menus', () => {
      const expectedMenusHome: MenuSidebar[] = [
        {
          title: 'Tablero',
          icon_google: 'apps',
          url: '/public/home/apps',
          id: 'apps'
        },
        {
          title: 'Proyectos',
          icon_svg: 'projects.svg',
          id: 'projects',
          submenus: [
            { title: 'Mis proyectos', url: '/public/home/projects' },
            { title: 'Reportes de ventas', url: '/public/home/salesreports' }
          ]
        },
        {
          title: 'Contactos',
          icon_svg: 'contacts.svg',
          id: 'contacts',
          submenus: [
            { title: 'Clientes', url: '/public/home/customers' },
            { title: 'Asesores inmobiliarios', url: '/public/home/realtors' }
          ]
        },
        {
          title: 'Finanzas',
          icon_svg: 'finance.svg',
          url: '/public/home/finance',
          id: 'finance'
        },
        {
          title: 'Agenda',
          icon_svg: 'agenda.svg',
          url: '/public/home/agenda',
          id: 'agenda'
        },
        {
          title: 'Mensajes',
          icon_svg: 'messages.svg',
          url: '/public/home/messages',
          id: 'messages'
        }
      ];

      const menusHome = service.getMenusHome();
      expect(menusHome).toEqual(expectedMenusHome);
    });
  });

  describe('getMenusDashboard', () => {
    it('should return the expected dashboard menus', () => {
      const expectedMenusDashboard: MenuSidebar[] = [
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
            { title: 'Membresias', url: '/internal/dashboard/membership' },
            { title: 'Empresas inmobiliarias', url: '/internal/dashboard/companies' }
          ]
        }
      ];

      const menusDashboard = service.getMenusDashboard();
      expect(menusDashboard).toEqual(expectedMenusDashboard);
    });
  });
});
