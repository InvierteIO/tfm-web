import {Component, Input, OnInit} from '@angular/core';
import {CollapseDirective} from "@common/directives/collapse.directive";
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf} from '@angular/common';
import Swal from 'sweetalert2';
import {MenuSidebar} from '../../models/menu-sidebar.model';
import { AuthService } from '@core/services/auth.service';
import { DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS } from '@common/dialogs/dialogs-swal.constants';

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

  constructor(public readonly router: Router, private readonly authService: AuthService) {
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

  get name(): string {
    return this.authService.getName();
  }

  get linkProfile(): string {
    const isOperator : boolean = this.authService.untilOperator();
    if(isOperator) {
      return '/internal/dashboard/profile'
    } else {
      return '/public/home/profile';
    }
  }

  logout(): void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Estás seguro de que deseas cerrar sesión?","Sí, salir" ))
      .then((result) => {
        if (result.isConfirmed) {
          const isOperator : boolean = this.authService.untilOperator();
          this.authService.logout();
          if(isOperator) {
            this.router.navigate(['/internal/auth/login']);            
          } else {
            this.router.navigate(['/public/auth/login']);
          }          
        }
      });    
  }
}
