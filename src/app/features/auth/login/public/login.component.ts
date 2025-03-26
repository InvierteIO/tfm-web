import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Router} from '@angular/router';
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';

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
              private readonly router: Router) {
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
    console.log('Formulario válido:', this.loginForm.value);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
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
