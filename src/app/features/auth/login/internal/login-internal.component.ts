import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from '@core/models/user-type.model';
import { LoginFormComponent } from "../login-form.component";
import { AuthLayoutComponent } from "../../shared/components/auth-layout.component";

@Component({
  selector: 'app-login-internal',
  templateUrl: './login-internal.component.html',
  styleUrls: [],
  imports: [LoginFormComponent, AuthLayoutComponent]
})
export class LoginInternalComponent {
  UserType = UserType;

  constructor(private readonly router: Router) { }
  
  onLoginSuccess(): void {    
    this.router.navigate(['/internal/dashboard/memberships']);
  }


  onForgotPassword(): void {
    this.router.navigate(['/internal/auth/forgot-password']);
  }
}
