import { Component } from '@angular/core';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-staff-profile-general-info',
  standalone: true,
  imports: [
    ButtonLoadingComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './staff-profile-general-info.component.html'
})
export class StaffProfileGeneralInfoComponent {
  form: FormGroup;
  loading:boolean = false;

  constructor(private readonly  fb: FormBuilder) {
    this.form = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      gender: ['', [Validators.required]],
      taxidentificationnumber: ['', Validators.pattern('^[0-9]{8}$')],
      birthday: ['', Validators.required],
      numbercontact: ['', Validators.pattern('^[0-9]{9}$')],
      jobtitle: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(255)]],
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

  get isGenderNotValid() {
    return this.form.get('gender')?.invalid && this.form.get('gender')?.touched;
  }

  get isTaxIdentificationNumberValid() {
    return this.form.get('taxidentificationnumber')?.invalid && this.form.get('taxidentificationnumber')?.touched;
  }

  get isBirthdayValid() {
    return this.form.get('birthday')?.invalid && this.form.get('birthday')?.touched;
  }

  get isNumberContactValid() {
    return this.form.get('numbercontact')?.invalid && this.form.get('numbercontact')?.touched;
  }

  get isJobTitleValid() {
    return this.form.get('jobtitle')?.invalid && this.form.get('jobtitle')?.touched;
  }

  get isAddressValid() {
    return this.form.get('address')?.invalid && this.form.get('address')?.touched;
  }

}

