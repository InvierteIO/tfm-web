import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Router} from '@angular/router';
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';
import {FormUtil} from '@common/utils/form.util';

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
      FormUtil.markAllAsTouched(this.loginForm);
      return;
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loading = true;
    console.log('Formulario válido:', this.loginForm.value);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);
    //this.router.navigate(['/public/home/maintenance']);
  }

  get isEmailNotValid() {
    return this.loginForm.get('email')?.invalid && this.loginForm.get('email')?.touched;
  }

  get isPasswordNotValid() {
    return this.loginForm.get('password')?.invalid && this.loginForm.get('password')?.touched;
  }

  goSignUp(): void {
    this.router.navigate(['/public/auth/signup/register-info']);
  }
}
