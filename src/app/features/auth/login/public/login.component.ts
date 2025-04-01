import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';
import { UserType } from '@core/models/user-type.model';
import { LoginFormComponent } from "../login-form.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginFormComponent, AuthLayoutComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  UserType = UserType;

  constructor(private readonly router: Router) { }

  onLoginSuccess(): void {
    this.router.navigate(['/public/home/maintenance']);
  }

  onSignUp(): void {
    this.router.navigate(['/public/auth/signup/register-info']);
  }

  onForgotPassword(): void {
    this.router.navigate(['/public/auth/forgot-password']);
  }
}
