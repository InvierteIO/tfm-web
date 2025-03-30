import {Component, OnInit} from '@angular/core';
import {CollapseDirective} from "@common/directives/collapse.directive";
import {HeaderComponent} from "../shared/components/header/header.component";
import {RouterOutlet} from "@angular/router";
import { AuthService } from '@core/services/auth.service';  


@Component({
  selector: 'app-dashboard',
    imports: [
        CollapseDirective,
        HeaderComponent,
        RouterOutlet
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  sidebarCollapsed = false;
  currentDropdown: string | null = null;

  constructor(private auth : AuthService) {}

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

  getName(): string {
    return this.auth.getName();
  }
}

