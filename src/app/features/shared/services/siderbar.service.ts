import { Injectable } from '@angular/core';
import {MenuSidebar} from '../models/menu-sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private readonly menusHome: MenuSidebar[] = [
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
      activeUrls: [
        '/public/home/project-new',
        '/public/home/project-draft',
        '/public/home/project-info'
      ],
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
        { title: 'Clientes', url: '/public/home/clients' },
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
    },
    {
      title: 'Usuarios',
      icon_svg: 'person_shield.svg',
      url: '/public/home/users',
      id: 'person_shield'
    }
  ];

  private readonly menusDashboard: MenuSidebar[] = [
    {
      title: 'Tablero',
      icon_google: 'apps',
      url: '/internal/dashboard/apps',
      id: 'apps'
    },
    {
      title: 'Mantenimientos',
      icon_google:'settings',
      id: 'settings',
      submenus: [
        { title: 'Membresias', url: '/internal/dashboard/memberships' },
        { title: 'Empresas inmobiliarias', url: '/internal/dashboard/companies' }
      ]
    }
  ];
  constructor() {}

  getMenusHome(): MenuSidebar[] {
    return this.menusHome;
  }

  getMenusDashboard(): MenuSidebar[] {
    return this.menusDashboard;
  }
}
