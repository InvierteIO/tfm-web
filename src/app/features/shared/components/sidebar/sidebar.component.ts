import {Component, Input, OnInit} from '@angular/core';
import {CollapseDirective} from "@common/directives/collapse.directive";
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from '@angular/common';
import Swal from 'sweetalert2';
import {MenuSidebar} from '../../models/menu-sidebar.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CollapseDirective,
    RouterLink,
    RouterLinkActive,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  sidebarCollapsed = false;
  currentDropdown: string | null = null;
  @Input() menus: MenuSidebar[] = [];

  constructor(readonly router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    if (window.innerWidth <= 1024) {
      this.sidebarCollapsed = true;
    }
  }

  isOpen(dropdownId: string): boolean {
    return this.currentDropdown === dropdownId;
  }

  onDropdownClick(event: MouseEvent, dropdownId: string): void {
    event.preventDefault();
    this.currentDropdown = this.isOpen(dropdownId) ? null : dropdownId;
  }

  toggleSidebar(): void {
    this.currentDropdown = null;
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isMenuActive(menu: MenuSidebar): boolean {
    const currentUrl = this.router.url;

    if (!menu.submenus || menu.submenus.length === 0) {
      return menu.url === currentUrl;
    }

    return menu.submenus.some(sub => currentUrl.startsWith(sub.url));
  }

  getName(): string {
    return this.authService.getName();
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#066B4B",
      cancelButtonColor: "#F9B234",
      customClass: {
        title: 'title-tp-h1 io-green-primary mt-4 mb-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/public/auth/login']);
      }
    });
  }
}
