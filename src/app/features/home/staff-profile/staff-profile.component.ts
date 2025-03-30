import { Component } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {StaffProfileGeneralInfoComponent} from './staff-profile-general-info.component';
import {StaffProfileCompanyInfoComponent} from './staff-profile-company-info.component';
import {ChangePasswordComponent} from '../../shared/components/change-password/change-password.component';

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

}
