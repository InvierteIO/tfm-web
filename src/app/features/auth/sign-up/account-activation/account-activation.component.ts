import { Component } from '@angular/core';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';

@Component({
  selector: 'app-account-activation',
  imports: [
    ButtonLoadingComponent,
    FormsModule,
    ReactiveFormsModule,
    AuthLayoutComponent
  ],
  templateUrl: './account-activation.component.html'
})
export class AccountActivationComponent {
  loading: boolean = false;

  constructor() {
  }

  onSubmit(): void {
    this.loading = true;
  }
}
