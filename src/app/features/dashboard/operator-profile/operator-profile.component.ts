import { Component } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {OperatorProfileGeneralInfoComponent} from './operator-profile-general-info.component';
import {ChangePasswordComponent} from '../../shared/components/change-password/change-password.component';

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
  loading:boolean = false;
}
