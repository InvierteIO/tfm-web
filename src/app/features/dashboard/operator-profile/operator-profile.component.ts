import { Component } from '@angular/core';
import {OperatorProfileGeneralInfoComponent} from './operator-profile-general-info.component';
import {ChangePasswordComponent} from '../../shared/components/change-password/change-password.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-operator-profile',
  standalone: true,
  imports: [
    OperatorProfileGeneralInfoComponent,
    ChangePasswordComponent
  ],
  templateUrl: './operator-profile.component.html'
})
export class OperatorProfileComponent {
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
