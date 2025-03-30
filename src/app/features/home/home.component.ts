import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../shared/components/header/header.component';
import {SidebarComponent} from '../shared/components/sidebar/sidebar.component';
import {MenuSidebar} from '../shared/models/menu-sidebar.model';
import {SidebarService} from '../shared/services/siderbar.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus: MenuSidebar[] = [];
  constructor(private readonly sidebarService: SidebarService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.menus = this.sidebarService.getMenusHome();
  }

  getName(): string {
    return this.authService.getName();
  }

}
