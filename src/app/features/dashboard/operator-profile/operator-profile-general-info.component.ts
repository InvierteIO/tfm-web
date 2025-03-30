import { Component } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FormUtil} from '@common/utils/form.util';
import {NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

@Component({
  selector: 'app-operator-profile-general-info',
  standalone: true,
  imports: [
    ButtonLoadingComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './operator-profile-general-info.component.html'
})
export class OperatorProfileGeneralInfoComponent {
  form: FormGroup;
  loading:boolean = false;

  constructor(private readonly  fb: FormBuilder,
              private readonly router: Router) {
    this.form = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    const fullname = this.form.get('fullname')?.value;
    const fullsurname = this.form.get('fullsurname')?.value;
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información general de tu perfil?"))
      .then((result) => {
        if (result.isConfirmed) {
        }
      });

  }

  get formCurrent() {
    return this.form?.controls;
  }

  get isFullnameNotValid() {
    return this.form.get('fullname')?.invalid && this.form.get('fullname')?.touched;
  }

  get isFullsurnameNotValid() {
    return this.form.get('fullsurname')?.invalid && this.form.get('fullsurname')?.touched;
  }

}
