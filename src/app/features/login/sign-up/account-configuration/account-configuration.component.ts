import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-configuration',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    ButtonLoadingComponent
  ],
  templateUrl: './account-configuration.component.html',
  styleUrl: './account-configuration.component.css'
})
export class AccountConfigurationComponent {
  form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      companyname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(150)] ],
      ruc: ['', [Validators.required, Validators.minLength(11),Validators.maxLength(11)]],
      rolname: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      numberusers: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{0,4}$')]]
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
    }
    const companyname = this.form.get('companyname')?.value;
    const ruc = this.form.get('ruc')?.value;
    const rolname = this.form.get('rolname')?.value;
    const numberusers = this.form.get('numberusers')?.value;
    this.loading = true;

    console.log('Formulario válido:', this.form.value);
    console.log(`companyname: ${companyname}`);
    console.log(`ruc: ${ruc}`);
    console.log(`rolname: ${rolname}`);
    console.log(`numberusers: ${numberusers}`);

    this.router.navigate(['/auth/signup/account-activation']);
  }

  get companynameEmpty() {
    return this.form.get('companyname')?.invalid && this.form.get('companyname')?.touched
      && this.form.get('companyname')?.errors?.["required"];
  }

  get companynameNotValidMinMax(){
    return !!(this.form.get('companyname')?.invalid && this.form.get('companyname')?.touched &&
      !this.form.get('companyname')?.errors?.["required"] && (
        this.form.get('companyname')?.errors?.["minlength"] ||
        this.form.get('companyname')?.errors?.["maxlength"]
      ));
  }

  get rucEmpty() {
    return this.form.get('ruc')?.invalid && this.form.get('ruc')?.touched
      && this.form.get('ruc')?.errors?.["required"];
  }

  get rucNotValidMinMax(){
    return !!(this.form.get('ruc')?.invalid && this.form.get('ruc')?.touched &&
      !this.form.get('ruc')?.errors?.["required"] && (
        this.form.get('ruc')?.errors?.["minlength"] ||
        this.form.get('ruc')?.errors?.["maxlength"]
      ));
  }

  get rolnameEmpty() {
    return this.form.get('rolname')?.invalid && this.form.get('rolname')?.touched
      && this.form.get('rolname')?.errors?.["required"];
  }

  get rolnameNotValidMinMax(){
    return !!(this.form.get('rolname')?.invalid && this.form.get('rolname')?.touched &&
      !this.form.get('rolname')?.errors?.["required"] && (
        this.form.get('rolname')?.errors?.["minlength"] ||
        this.form.get('rolname')?.errors?.["maxlength"]
      ));
  }

  get numberusersEmpty() {
    return this.form.get('numberusers')?.invalid && this.form.get('numberusers')?.touched
      && this.form.get('numberusers')?.errors?.["required"];
  }

  get numberusersNotValid(){
    return !!(this.form.get('numberusers')?.invalid && this.form.get('numberusers')?.touched &&
      !this.form.get('numberusers')?.errors?.["required"]);
  }
}
