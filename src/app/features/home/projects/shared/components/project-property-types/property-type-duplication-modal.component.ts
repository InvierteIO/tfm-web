import {Component, Input} from '@angular/core';
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {ProjectStageDtoMock} from '../../models/project-stage.mock.dto.model';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {stageRomanValidator} from '@common/validators/stage.validator';
import {FormUtil} from '@common/utils/form.util';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {StagePropertyGroupDtoMock} from '../../models/stage-property-group.dto.mock.model';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-property-type-duplication-modal',
  imports: [
    ButtonLoadingComponent,
    FormErrorMessagesPipe,
    FormsModule,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './property-type-duplication-modal.component.html'
})
export class PropertyTypeDuplicationModalComponent {
  @Input()
  propertyGroup!: PropertyGroupMock;
  @Input()
  projectStages: ProjectStageMock[] = [];
  form: FormGroup;
  loading:boolean = false;

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly projectPropertyTypeSvc: ProjectPropertyTypesService,
              private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup  {
    return this.fb.group({
      name: ['', [Validators.required]],
      stages: ['', [Validators.required, stageRomanValidator]]
    });
  }

  duplicate(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }

    this.loading= true;
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION](`¿Desea duplicar '${this.propertyGroup.name}'
       con las mismas características con el nombre de '${this.form.get('name')?.value}'?`))
      .then((result) => {
        if (result.isConfirmed) {
          this.projectPropertyTypeSvc.duplicate(this.captureData())
            .pipe(finalize(() => this.loading= false))
            .subscribe(spgs => this.activeModal.close(spgs));
        }
      });
  }

  private captureData(): StagePropertyGroupDtoMock[] {
    let stagePropertyGroups: StagePropertyGroupDtoMock[] = [];
    this.propertyGroup.name = this.form.get('name')?.value;
    let stages: PropertyGroupMock[] = this.form.get('stages')?.value as PropertyGroupMock[] ;
    stages.forEach((stage: any) => {
      stagePropertyGroups.push({ stage, propertyGroup: this.propertyGroup });
    });;
    return stagePropertyGroups
  }
}
