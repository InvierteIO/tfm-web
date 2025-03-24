import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {LoadingComponent} from '@common/components/loading.component';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonLoadingComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
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
}
