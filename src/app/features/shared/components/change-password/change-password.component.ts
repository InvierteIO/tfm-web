import { Component, OnInit } from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import { AuthService } from '@core/services/auth.service';
import { ChangePasswordService } from '../../services/change-password.service';
import { PasswordChange } from '../../models/password-change.model';
import { LoadingComponent } from "../../../../common/components/loading.component";

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [
    ButtonLoadingComponent,
    ReactiveFormsModule,
    NgIf,
    LoadingComponent
],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  loading:boolean = false;
  emailSession:string = ""; 

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthService,
    private readonly changePasswordService : ChangePasswordService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.emailSession = this.authService.getEmail();
  } 

  createForm() : FormGroup {
    return this.fb.group({
      oldpassword: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
      repeatedpwd: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {      
      FormUtil.markAllAsTouched(this.form);
      return;
    }

    const password = this.form.get('password')?.value;
    const oldpassword = this.form.get('oldpassword')?.value;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea cambiar su contraseña?"))
      .then((result) => {
        if (result.isConfirmed) {
          let passwordChange: PasswordChange = {
              password: oldpassword, newPassword: password
          }
          this.loading = true;
          this.changePasswordService.updatePassword(this.emailSession, passwordChange)
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

  get isOldPasswordNotValid() {
    return this.form.get('oldpassword')?.invalid && this.form.get('oldpassword')?.touched;
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
