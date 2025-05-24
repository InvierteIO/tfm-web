import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { UserType } from '@core/models/user-type.model';
import { FormUtil } from '@common/utils/form.util';
import { ButtonLoadingComponent } from "@common/components/button-loading.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css','../shared/components/sign-up.component.css'],
  imports: [ButtonLoadingComponent ,
    ButtonLoadingComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule]
})
export class LoginFormComponent {
  @Input() userType!: UserType;
  @Input() showAdditionalActions: boolean = false;
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() loginError = new EventEmitter<void>();
  @Output() signUpSuccess = new EventEmitter<void>();
  @Output() forgotPasswordSuccess = new EventEmitter<void>();

  loginForm: FormGroup;
  loading: boolean = false;

  constructor(
      private readonly fb: FormBuilder,
      private readonly auth: AuthService
  ) {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      FormUtil.markAllAsTouched(this.loginForm);
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.loading = true;
    this.auth.login(email, password, this.userType)
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.loginSuccess.emit();
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  get isEmailNotValid(): boolean | undefined {
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  get isPasswordNotValid(): boolean | undefined {
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
  }

  goForgotPassword(): void {
    this.forgotPasswordSuccess.emit();
  }

  goSignUp(): void {
    this.signUpSuccess.emit();
  }
}
