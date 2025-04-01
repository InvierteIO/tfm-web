import { Component } from '@angular/core';
import {StaffProfileGeneralInfoComponent} from './staff-profile-general-info.component';
import {StaffProfileCompanyInfoComponent} from './staff-profile-company-info.component';
import {ChangePasswordComponent} from '../../shared/components/change-password/change-password.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [
    StaffProfileGeneralInfoComponent,
    StaffProfileCompanyInfoComponent,
    ChangePasswordComponent
  ],
  templateUrl: './staff-profile.component.html'
})
export class StaffProfileComponent {
  loading : boolean = false;

  constructor(private readonly authService: AuthService) {
  }
  

  get name(): string {
    return this.authService.getName();
  }

  get email(): string {
    return this.authService.getEmail();
  }  
}
