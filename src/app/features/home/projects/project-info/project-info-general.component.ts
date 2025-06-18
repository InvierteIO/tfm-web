import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProjectMock} from '../shared/models/project.mock.model';
import {FormUtil} from '@common/utils/form.util';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {NgForOf, NgIf} from '@angular/common';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {LoadingService} from '@core/services/loading.service';

@Component({
  selector: 'app-project-info-general',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonLoadingComponent,
    NgIf,
    FormErrorMessagesPipe,
    NgForOf
  ],
  templateUrl: './project-info-general.component.html'
})
export class ProjectInfoGeneralComponent implements OnInit {
  @Input()
  public project?: ProjectMock
  public form: FormGroup;
  loading:boolean = false;
  constructor(private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadDataForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(100)]],
      office_address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      office_number: ['', [Validators.maxLength(6)]],
      supervisor: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      zipcode: ['', [Validators.required,  Validators.minLength(6), Validators.pattern('^[1-9][0-9]{0,8}$')]]
    });
  }

  private loadDataForm(): void {
    this.form?.reset({
      project_name: this.project?.name,
      office_address: this.project?.officeAddress,
      office_number: this.project?.officeNumber,
      supervisor: this.project?.supervisor,
      description: this.project?.description,
      address: this.project?.address,
      zipcode: this.project?.zipCode
    });
  }

  public save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea actualizar la información general del proyecto?"))
      .then((result) => {
        this.loadingService.hide();
        if (result.isConfirmed) {

        }
      });
  }

  get isFieldNotValid() {
    return (field: string) =>
      this.form?.get(field)?.invalid && this.form?.get(field)?.touched;
  }

}
