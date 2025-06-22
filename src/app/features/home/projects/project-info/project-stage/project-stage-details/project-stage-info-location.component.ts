import {Component, Input} from '@angular/core';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '@core/services/loading.service';
import {
  LocationInformationComponent
} from '../../../shared/components/location-information/location-information.component';
import {ProjectStageDtoMock} from '../../../shared/models/project-stage.mock.dto.model';
import {FormUtil} from '@common/utils/form.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

@Component({
  selector: 'app-project-stage-info-location',
  imports: [
    ButtonLoadingComponent,
    FormsModule,
    ReactiveFormsModule,
    LocationInformationComponent
  ],
  templateUrl: './project-stage-info-location.component.html'
})
export class ProjectStageInfoLocationComponent {
  @Input()
  projectStageCurrent?:ProjectStageDtoMock;
  @Input()
  isView = false;
  loading: boolean = false;
  public form: FormGroup;

  public constructor(private readonly fb: FormBuilder,
                     private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  private buildForm():FormGroup {
    return this.fb.group({});
  }

  save():void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información de la ubicación?"))
      .then((result) => {
        this.loadingService.hide();
        if (result.isConfirmed) {

        }
      });
  }
}
