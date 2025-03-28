import { Component, OnInit } from '@angular/core';
import {CollapseDirective} from '@common/directives/collapse.directive';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CollapseDirective,
    RouterOutlet,
    HeaderComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sidebarCollapsed = false;
  currentDropdown: string | null = null;

  constructor() {}

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
}
