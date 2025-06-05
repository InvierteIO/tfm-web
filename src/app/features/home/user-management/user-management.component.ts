import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { catchError, concatMap, finalize } from 'rxjs/operators';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {Observable, of} from 'rxjs';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import { LoadingComponent } from "@common/components/loading.component";
import { UserManagementService } from './user-management.service';
import {Staff} from "@core/models/staff.model";


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: true,
  imports: [    
    ButtonLoadingComponent,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    LoadingComponent
  ],  
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  userForm: FormGroup;
  loading:boolean = false;

  constructor(private fb: FormBuilder, 
    private readonly authService: AuthService,
    private readonly userManagementService: UserManagementService
  ) {
    this.userForm = this.createForm();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      identitydocument: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      birthday: ['', [Validators.required]],
      numbercontact: ['', [Validators.pattern('^[0-9]{9}$')]],
      jobtitle: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(255)]],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      FormUtil.markAllAsTouched(this.userForm);
      return;
    }

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea crear el nuevo usuario?"))
      .then((result) => {
        if (result.isConfirmed) {      
          this.loading = true;
          this.createUser().subscribe();
          this.userForm.reset();
          this.loading = false;
        }
      });

    
  }

  
  createUser(): Observable<void> {

    const firstName = this.userForm.get('fullname')?.value;
    const familyName = this.userForm.get('fullsurname')?.value;
    const email = this.userForm.get('email')?.value;
    const gender = this.userForm.get('gender')?.value;
    const companyRole = this.userForm.get('role')?.value;
    const identityDocument = this.userForm.get('identitydocument')?.value;
    const birthDate = this.userForm.get('birthday')?.value;
    const phone = this.userForm.get('numbercontact')?.value;
    const jobTitle = this.userForm.get('jobtitle')?.value;
    const address = this.userForm.get('address')?.value;    
    const taxIdentificationNumber = '10449080004';

    const staffDto: Staff = {
      email: email,
      firstName: firstName,
      familyName: familyName,
      companyRole: companyRole,
      birthDate: birthDate,
      identityDocument: identityDocument,
      jobTitle: jobTitle,
      address: address,
      phone: phone,
      taxIdentificationNumber: taxIdentificationNumber,
      gender: gender            
    };

    return this.userManagementService.createStaffUser(staffDto).pipe(
      concatMap(() => this.userManagementService.notifyActivationCode(staffDto.email, staffDto.taxIdentificationNumber!)),
      finalize(() => (this.loading = false)),
      catchError(error => {
        console.error('Error during account creation:', error);
        return of();
      })
    );                      

  }

  sendActivationLink(staff: Staff): void {
    alert(`Activation link sent to ${staff.email}`);
  }

  resetPassword(staff: Staff): void {
    alert(`Password reset link sent to ${staff.email}`);
  }

  inactivateUser(staff: Staff): void {
    //user.isActive = false;
  }

  get formCurrent() {
    return this.userForm?.controls;
  }

  get isFullnameNotValid() {
    return this.userForm.get('fullname')?.invalid && this.userForm.get('fullname')?.touched;
  }

  get isFullsurnameNotValid() {
    return this.userForm.get('fullsurname')?.invalid && this.userForm.get('fullsurname')?.touched;
  }

  get isGenderNotValid() {
    return this.userForm.get('gender')?.invalid && this.userForm.get('gender')?.touched;
  }

  get isRoleNotValid() {
    return this.userForm.get('role')?.invalid && this.userForm.get('role')?.touched;
  }

  get isIdentityDocumentNumberValid() {
    return this.userForm.get('identitydocument')?.invalid && this.userForm.get('identitydocument')?.touched;
  }

  get isBirthdayValid() {
    return this.userForm.get('birthday')?.invalid && this.userForm.get('birthday')?.touched;
  }

  get isNumberContactValid() {
    return this.userForm.get('numbercontact')?.invalid && this.userForm.get('numbercontact')?.touched;
  }

  get isJobTitleValid() {
    return this.userForm.get('jobtitle')?.invalid && this.userForm.get('jobtitle')?.touched;
  }

  get isAddressValid() {
    return this.userForm.get('address')?.invalid && this.userForm.get('address')?.touched;
  }

  get emailNotValid() {
    return this.userForm.get('email')?.invalid && this.userForm.get('email')?.touched
      && this.userForm.get('email')?.errors?.["required"];
  }

  get emailNotValidMinMaxFormat() {
    return !!(this.userForm.get('email')?.invalid && this.userForm.get('email')?.touched &&
      !this.userForm.get('email')?.errors?.["required"] && (
        this.userForm.get('email')?.errors?.["email"] ||
        this.userForm.get('email')?.errors?.["minlength"] ||
        this.userForm.get('email')?.errors?.["maxlength"]));
  }
}
