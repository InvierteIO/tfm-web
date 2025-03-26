import { Component } from '@angular/core';
import {AuthLayoutComponent} from "../../shared/components/auth-layout.component";
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-internal',
    imports: [
        AuthLayoutComponent,
        ButtonLoadingComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './login-internal.component.html',
  styleUrl: './login-internal.component.css'
})
export class LoginInternalComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router) {
    this.loginForm = this.builForm();
  }

  onSubmit() : void {
    this.router.navigate(['/internal/dashboard']);
  }

  get isEmailNotValid() {
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  get isPasswordNotValid() {
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
  }

  builForm() : FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
}
