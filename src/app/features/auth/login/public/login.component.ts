import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Router} from '@angular/router';
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';
import {AuthService} from '@core/services/auth.service';
import { UserType } from '@core/models/user-type.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonLoadingComponent, AuthLayoutComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router, 
              private readonly auth: AuthService) {
    this.loginForm = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
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

    this.loading = true;
    this.auth.login(email, password, UserType.STAFF)
    .subscribe({
      next: (user) => {
        if (this.auth.untilStaff()) {
          this.router.navigate(['/public/home/maintenance']);
        } else {
          console.log("Logueo invalido."); 
        }        
      },
      error:(error) => {
        console.log("Error de autenticación. Por favor, verifica tus credenciales.");        
      }        
    });
    this.loading = false;    
  }

  get emailNotValid() {
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  get passwordNotValid() {
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
  }

  goSignUp(): void {
    this.router.navigate(['/public/auth/signup/register-info']);
  }
}
