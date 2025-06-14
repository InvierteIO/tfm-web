import {Component, Input} from '@angular/core';
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
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
  form: FormGroup;
  loading:boolean = false;
  stages: string[] = ['I','II','III','IV','V'];
  //Son el listado de Project stage que se muestra el stage (n° romano)

  constructor(public readonly activeModal: NgbActiveModal,
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
        this.loading= false;
        if (result.isConfirmed) {
          this.activeModal.close(this.captureData());
        }
      });
  }

  private captureData(): StagePropertyGroupDtoMock[] {
    let stagePropertyGroups: StagePropertyGroupDtoMock[] = [];
    let name = this.form.get('name')?.value;
    this.form.get('stages')?.value.forEach((stageRoman: string, index: number) =>
      stagePropertyGroups.push({
        stage : {
          id: (this.form.get('stages')?.value as string[]).length + index,
          stage: stageRoman
        },
        propertyGroup: {
          id: 10+index,
           name
        }
      }));
    return stagePropertyGroups
  }
}
