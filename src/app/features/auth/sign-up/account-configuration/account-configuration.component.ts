import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {Router} from '@angular/router';
import {AuthLayoutComponent} from '../../shared/components/auth-layout.component';
import { catchError, concatMap, finalize } from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RegisterPersonalInfoService} from '../register-personal-info/register-personal-info.service';
import {AccountConfigurationService} from './account-configuration.service'
import {Staff} from "@core/models/staff.model"
import {UserCompany} from "../models/user-company.model"
import {Company} from "@core/models/company.model"
import { Role } from '@core/models/role.model';
import {FormUtil} from '@common/utils/form.util';

@Component({
  selector: 'app-account-configuration',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    ButtonLoadingComponent,
    AuthLayoutComponent
  ],
  templateUrl: './account-configuration.component.html'
})
export class AccountConfigurationComponent {
  form: FormGroup;
  loading: boolean = false;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router,
              private readonly registerPersonalInfoService: RegisterPersonalInfoService,
              private readonly accountConfigurationService: AccountConfigurationService) {
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
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    const companyname = this.form.get('companyname')?.value;
    const ruc = this.form.get('ruc')?.value;
    const rolname = this.form.get('rolname')?.value;
    const numberusers = this.form.get('numberusers')?.value;
    this.loading = true;

    const currentFormData = this.registerPersonalInfoService.getFormData()
    this.registerPersonalInfoService.setFormData({
      firstName: currentFormData!.firstName,
      familyName: currentFormData!.familyName,
      email: currentFormData!.email,
      password: currentFormData!.password,
      companyName: companyname,
      ruc: ruc,
      rolname: rolname,
      numberUsers: numberusers,
    });

    const updatedFormData = this.registerPersonalInfoService.getFormData()
    this.createAccountAndCompany(updatedFormData)
    .subscribe(response => {
      this.router.navigate(['/public/auth/signup/account-activation']);
    });

  }

  createAccountAndCompany(formData: any): Observable<void> {

    const staff: Staff = {
      firstName: formData.firstName,
      familyName: formData.lastName,
      email: formData.email,
      password: formData.password,
      companyRole: Role.OWNER
    };

    const company: Company = {
      taxIdentificationNumber: formData.ruc,
      name: formData.companyName,
      allowedMemberQuantity: formData.numberUsers
    };

    const userCompany: UserCompany = {
      taxIdentificationNumber: formData.ruc
    };

    return this.accountConfigurationService.addStaffUserNoCompany(staff).pipe(
      concatMap(() => this.accountConfigurationService.addCompany(company)),
      concatMap(() => this.accountConfigurationService.setUserCompany(staff.email, userCompany)),
      concatMap(() => this.accountConfigurationService.notifyActivationCode(staff.email, company.taxIdentificationNumber!)),
      finalize(() => (this.loading = false)),
      catchError(error => {
        console.error('Error during account creation:', error);
        return of();
      })
    );
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
