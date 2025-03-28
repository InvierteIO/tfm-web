import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../shared/components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from '../shared/components/sidebar/sidebar.component';
import {MenuSidebar} from '../shared/models/menu-sidebar.model';
import {SidebarService} from '../shared/services/siderbar.service';

@Component({
  selector: 'app-dashboard',
    imports: [
        SidebarComponent,
        HeaderComponent,
        RouterOutlet
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  menus: MenuSidebar[] = [];
  constructor(private readonly sidebarService: SidebarService) {
  }

  ngOnInit(): void {
    this.menus = this.sidebarService.getMenusDashboard();
  }
}

