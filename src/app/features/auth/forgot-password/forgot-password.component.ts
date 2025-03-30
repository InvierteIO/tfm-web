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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  
  forgotPasswordForm: FormGroup;
  message: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,    
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    const email = this.forgotPasswordForm.value.email;
    
  }
}
