import { Component } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [
    ButtonLoadingComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading:boolean = false;

  constructor(private readonly  fb: FormBuilder) {
    this.form = this.createForm();
  }
  createForm() : FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
      repeatedpwd: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Formulario inválido');
      FormUtil.markAllAsTouched(this.form);
      return;
    }

    const password = this.form.get('password')?.value;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea cambiar su contraseña?"))
      .then((result) => {
        if (result.isConfirmed) {
        }
      });
  }

  get formCurrent() {
    return this.form?.controls;
  }

  get isPasswordNotValid() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }

  get isRepeatedpwdNotValid() {
    const password = this.form.get('password')?.value;
    const repeatedpwd = this.form.get('repeatedpwd')?.value;
    return password !== repeatedpwd;
  }

}
