import { Component } from '@angular/core';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {LoadingService} from '@core/services/loading.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {ProjectMultimediaComponent} from '../../../shared/components/project-multimedia/project-multimedia.component';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';

@Component({
  selector: 'app-project-stage-info-general',
  imports: [
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    NgForOf,
    NgIf,
    IsInvalidFieldPipe,
    ProjectMultimediaComponent,
    ButtonLoadingComponent
  ],
  templateUrl: './project-stage-info-general.component.html'
})
export class ProjectStageInfoGeneralComponent {
  public form: FormGroup;
  loading:boolean = false;

  public constructor(private readonly fb: FormBuilder,
                      private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  public save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información general?"))
      .then((result) => {
        this.loadingService.hide();
        if (result.isConfirmed) {

        }
      });
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(100)]]
    });
  }

  private loadDataForm(): void {
    this.form?.reset({
      name: ''
    });
  }
}
