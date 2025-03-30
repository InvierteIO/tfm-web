import { Component } from '@angular/core';
import {AuthLayoutComponent} from "../../shared/components/auth-layout.component";
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router} from '@angular/router';
import {AuthService} from '@core/services/auth.service';
import { UserType } from '@core/models/user-type.model';

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
              private readonly router: Router, 
              private readonly auth: AuthService) {
    this.loginForm = this.builForm();
  }

  onSubmit() : void {
    if (this.loginForm.invalid) {
      console.log('Formulario inválido');
      Object.values(this.loginForm.controls).forEach(control => {
        if(control instanceof FormGroup){
          Object.values(control.controls).forEach(control=> control.markAsTouched());
        }else control.markAsTouched();
      });
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.auth.login(email, password, UserType.OPERATOR)
    .subscribe({
      next: (user) => {
        if (this.auth.untilOperator()) {
          this.router.navigate(['/internal/dashboard']);
        } else {
          console.log("Logueo invalido."); 
        }        
      },
      error:(error) => {
        console.log("Error de autenticación. Por favor, verifica tus credenciales.");        
      }        
    });
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

  goForgotPassword(): void {
    this.router.navigate(['/public/auth/forgot-password']);
  }
}
