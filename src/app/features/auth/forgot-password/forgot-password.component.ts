import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {AuthLayoutComponent} from '../shared/components/auth-layout.component';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AuthLayoutComponent,
    NgIf
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  message: string | null = null;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
  }
}
