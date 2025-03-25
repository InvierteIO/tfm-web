import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-personal-info',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './register-personal-info.component.html',
  styleUrl: './register-personal-info.component.css'
})
export class RegisterPersonalInfoComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3),Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
      repeatedpwd: ['', Validators.required],
      numbercontact: ['', Validators.pattern('^[0-9]{9}$')]
    });
  }

  onSubmit(): void {
    console.log(this.form);
    if (this.form.invalid) {
      console.log('Formulario inválido');
      Object.values(this.form.controls).forEach(control => {
        if(control instanceof FormGroup){
          Object.values(control.controls).forEach(control=> control.markAsTouched());
        }else control.markAsTouched();
      });
      return;
    }
    const fullname = this.form.get('fullname')?.value;
    const fullsurname = this.form.get('fullsurname')?.value;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    console.log('Formulario válido:', this.form.value);
    console.log(`fullname: ${fullname}`);
    console.log(`fullname: ${fullsurname}`);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

    this.router.navigate(['/auth/signup/account-configuration']);
  }

  get fullnameNotValid() {
    return this.form.get('fullname')?.invalid && this.form.get('fullname')?.touched
      && this.form.get('fullname')?.errors?.["required"];
  }

  get fullnameNotValidMinMax(){
    return !!(this.form.get('fullname')?.invalid && this.form.get('fullname')?.touched &&
      !this.form.get('fullname')?.errors?.["required"] && (
      this.form.get('fullname')?.errors?.["minlength"] ||
      this.form.get('fullname')?.errors?.["maxlength"]
    ));
  }

  get fullsurnameNotValid() {
    return this.form.get('fullsurname')?.invalid && this.form.get('fullsurname')?.touched
      && this.form.get('fullsurname')?.errors?.["required"];
  }

  get fullsurnameNotValidMinMax() {
    return !!(this.form.get('fullsurname')?.invalid && this.form.get('fullsurname')?.touched &&
      !this.form.get('fullsurname')?.errors?.["required"] && (
        this.form.get('fullsurname')?.errors?.["minlength"] ||
        this.form.get('fullsurname')?.errors?.["maxlength"]
      ));
  }

  get emailNotValid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched
      && this.form.get('email')?.errors?.["required"];
  }

  get emailNotValidMinMaxFormat() {
    return !!(this.form.get('email')?.invalid && this.form.get('email')?.touched &&
      !this.form.get('email')?.errors?.["required"] && (
        this.form.get('email')?.errors?.["email"] ||
        this.form.get('email')?.errors?.["minlength"] ||
        this.form.get('email')?.errors?.["maxlength"]));
  }

  get passwordNotValid() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched
      && this.form.get('password')?.errors?.["required"];
  }
  get passwordNotValidMinMax() {
    return !!(this.form.get('password')?.invalid && this.form.get('password')?.touched &&
      !this.form.get('password')?.errors?.["required"] && (
        this.form.get('password')?.errors?.["minlength"] ||
        this.form.get('password')?.errors?.["maxlength"]));
  }

  get repeatedpwdNotValid() {
    const password = this.form.get('password')?.value;
    const repeatedpwd = this.form.get('repeatedpwd')?.value;
    return !(password === repeatedpwd);
  }

  get numbercontactNotValid() {
    return this.form.get('numbercontact')?.invalid && this.form.get('numbercontact')?.touched;
  }
}
