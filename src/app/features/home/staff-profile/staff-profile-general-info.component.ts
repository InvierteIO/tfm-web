import { Component, OnInit,  } from '@angular/core';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {NgIf} from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { StaffProfileService } from './staff-profile.service';
import { StaffInfo } from './models/staff-info.model';
import { LoadingComponent } from "@common/components/loading.component";

@Component({
  selector: 'app-staff-profile-general-info',
  standalone: true,
  imports: [
    ButtonLoadingComponent,
    NgIf,
    ReactiveFormsModule,
    LoadingComponent
],
  templateUrl: './staff-profile-general-info.component.html'
})
export class StaffProfileGeneralInfoComponent  implements OnInit {
  form: FormGroup;
  loading:boolean = false;
  loadingInfo:boolean = false;
  emailSession:string = "";

  constructor(private readonly  fb: FormBuilder,
    private readonly staffProfileService: StaffProfileService,
    private readonly authService: AuthService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.emailSession = this.authService.getEmail();
    this.loadInfoData();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      gender: ['', [Validators.required]],
      identitydocument: ['', Validators.pattern('^[0-9]{8}$')],
      birthday: ['', Validators.required],
      numbercontact: ['', Validators.pattern('^[0-9]{9}$')],
      jobtitle: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(255)]],
    });
  }

  loadInfoData(): void {
    this.loadingInfo = true;
    this.staffProfileService.readInfoData(this.emailSession)
    .subscribe({
      next: (staff: StaffInfo) => {
        console.log(staff);
        this.form?.reset({
          fullname : staff.firstName,
          fullsurname : staff.familyName,
          gender: staff.gender,
          identitydocument: staff.identityDocument,
          birthday: staff.birthDate,
          numbercontact: staff.phone,
          jobtitle: staff.jobTitle,
          address: staff.address
        });
      },
      error: () => {
        this.loadingInfo = false;
      },
      complete: () => {
       this.loadingInfo = false;
    }});
  }

  onSubmit(): void {
    if (this.form.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    const firstName = this.form.get('fullname')?.value;
    const familyName = this.form.get('fullsurname')?.value;
    const gender = this.form.get('gender')?.value;
    const identityDocument = this.form.get('identitydocument')?.value;
    const birthDate = this.form.get('birthday')?.value;
    const phone = this.form.get('numbercontact')?.value;
    const jobTitle = this.form.get('jobtitle')?.value;
    const address = this.form.get('address')?.value;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información general de tu perfil?"))
      .then((result) => {
        if (result.isConfirmed) {
          const staffInfo : StaffInfo = { firstName, familyName, gender,identityDocument,
            birthDate,phone , jobTitle, address };
          this.loading = true;
          this.staffProfileService.updateInfoData(this.emailSession, staffInfo)
            .subscribe({
              error: () => {
                this.loading = false;
              },
              complete: () => {
              this.loading = false;
            }});
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

  get isIdentityDocumentNumberValid() {
    return this.form.get('identitydocument')?.invalid && this.form.get('identitydocument')?.touched;
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

