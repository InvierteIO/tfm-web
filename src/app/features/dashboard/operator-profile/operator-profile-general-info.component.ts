import { Component, OnInit } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import { OperatorProfileService } from './operador-profile.service';
import { AuthService } from '@core/services/auth.service';
import { UserGeneral } from '@core/models/user-general.model';
import { LoadingComponent } from "@common/components/loading.component";

@Component({
  selector: 'app-operator-profile-general-info',
  standalone: true,
  imports: [
    ButtonLoadingComponent,
    ReactiveFormsModule,
    NgIf,
    LoadingComponent
],
  templateUrl: './operator-profile-general-info.component.html'
})
export class OperatorProfileGeneralInfoComponent implements OnInit {
  form: FormGroup;
  loading:boolean = false;
  loadingInfo:boolean = false;
  emailSession:string = "";

  constructor(private readonly  fb: FormBuilder,
    private readonly operatorProfileService: OperatorProfileService,
    private readonly authService: AuthService) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.emailSession = this.authService.getEmail();
    this.loadInfoData();
  }

  createForm() : FormGroup {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)] ],
      fullsurname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]]
    });
  }

  loadInfoData(): void {
    this.loadingInfo = true;
    this.operatorProfileService.readInfoData(this.emailSession)
    .subscribe({
      next: (user: UserGeneral) => {
        console.log(user);
        this.form?.reset({
          fullname : user.firstName,
          fullsurname : user.familyName
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
    const fullname = this.form.get('fullname')?.value;
    const fullsurname = this.form.get('fullsurname')?.value;
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información general de tu perfil?"))
      .then((result) => {
        if (result.isConfirmed) {
          const userGeneral : UserGeneral = { firstName: fullname, familyName: fullsurname};
          this.loading = true;
          this.operatorProfileService.updateInfoData(this.emailSession, userGeneral)
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

}
