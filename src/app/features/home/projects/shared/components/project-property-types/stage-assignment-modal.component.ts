import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {stageRomanValidator} from '@common/validators/stage.validator';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {PropertyGroupMock} from '../../models/property-group.mock.model';

@Component({
  selector: 'app-stage-assignment-modal',
  imports: [
    FormErrorMessagesPipe,
    FormsModule,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    NgSelectComponent,
    ReactiveFormsModule,
    ButtonLoadingComponent
  ],
  templateUrl: './stage-assignment-modal.component.html'
})
export class StageAssignmentModalComponent implements OnInit{
  @Input()
  propertyGroup!: PropertyGroupMock;
  @Input()
  stagesCurrent: ProjectStageMock[] = [];
  form: FormGroup;
  loading:boolean = false;
  stages: string[] = ['I','II','III','IV','V'];

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnInit() {
    this.stages =  this.stages.filter(stage => !this.stagesCurrent
      .map(projectStage => projectStage.stage)
      .includes(stage));
  }

  private buildForm(): FormGroup  {
    return this.fb.group({
      stages: ['', [Validators.required, stageRomanValidator]]
    });
  }

  assignment(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loading= true;
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION](`¿Desea asignar las etapas '${this.form.get('stages')?.value}'
       al tipo del inmueble '${this.propertyGroup.name}'?`))
      .then((result) => {
        this.loading= false;
        if (result.isConfirmed) {
          this.activeModal.close(this.form.get('stages')?.value);
        }
      });
  }
}
