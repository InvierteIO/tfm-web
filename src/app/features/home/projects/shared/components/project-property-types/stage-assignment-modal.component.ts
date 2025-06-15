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
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {StagePropertyGroupMock} from '../../models/stage-property-group.mock.model';
import {finalize} from 'rxjs/operators';

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
  @Input()
  projectStages: ProjectStageMock[] = [];
  form: FormGroup;
  projectStagesSelected: ProjectStageMock[] = [];
  loading:boolean = false;


  constructor(public readonly activeModal: NgbActiveModal,
              private readonly fb: FormBuilder,
              private readonly projectPropertyTypeSvc: ProjectPropertyTypesService,) {
    this.form = this.buildForm();
  }

  ngOnInit() {
    this.loadData();
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
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION](`¿Desea asignar las etapas
       '${(this.form.get('stages')?.value as ProjectStageMock[]).map(projectStage => projectStage.stage).join()}'
       al tipo del inmueble '${this.propertyGroup.name}'?`))
      .then((result) => {
        this.loading= false;
        if (result.isConfirmed) {
          let stageProjectStages: StagePropertyGroupMock[] = [];
          (this.form.get('stages')?.value as ProjectStageMock[]).forEach(sgp => {
              stageProjectStages.push({propertyGroup: this.propertyGroup, stage: sgp});
          });
          ;
          this.projectPropertyTypeSvc.assigment(stageProjectStages)
            .pipe(finalize(()=> this.activeModal.close(stageProjectStages)))
            .subscribe();
        }
      });
  }

  private loadData(): void {
    this.projectStagesSelected = this.projectStages
      .filter(stage => !this.stagesCurrent.some(current => current.stage === stage.stage));
  }
}
