import { Injectable } from '@angular/core';
import {MenuSidebar} from '../models/menu-sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private menusHome: MenuSidebar[] = [
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

  private menusDashboard: MenuSidebar[] = [
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
        { title: 'Membresias', url: '/internal/dashboard/membership' },
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
