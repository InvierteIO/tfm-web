import { Component } from '@angular/core';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-account-activation',
    imports: [
        ButtonLoadingComponent,
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './account-activation.component.html',
  styleUrl: './account-activation.component.css'
})
export class AccountActivationComponent {
  loading: boolean = false;

  constructor() {
  }

  onSubmit(): void {
    this.loading = true;
  }
}
