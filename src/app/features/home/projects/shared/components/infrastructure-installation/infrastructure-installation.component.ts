import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {InfrastructureInstallationMock} from '../../models/infrastructure-installation.mock';
import {InstallationType} from '../../models/installation-data.type';
import {InstallationDataType} from '../../models/installation-type.model';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from '../../models/project.mock.model';
import {finalize, map} from 'rxjs/operators';
import {Observable, throwError, of, tap, forkJoin} from "rxjs";
import {ProjectService} from '../../services/project.service';
import {StageInfrastructureInstallationMock} from '../../models/stage-infrastructure-installation.mock.model';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {StageCatalogDetail} from '../../models/stage-catalog-detail';
import {CatalogDetailMock} from '../../../../shared/models/catalog-detail.mock.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {ProjectStageDtoMock} from '../../models/project-stage.mock.dto.model';
import {ProjectStoreService} from '../../services/project-store.service';
import {ProjectDraftStatus} from '../../models/project-draft-status';
import {InfrastructureInstallationService} from '../../services/infrastructure-installation.service';

@Component({
  selector: 'app-infrastructure-installation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectStyleDirective,
    IsInvalidFieldPipe,
    FormErrorMessagesPipe,
    NgIf,
    NgForOf,
    ButtonLoadingComponent,
    NgTemplateOutlet
  ],
  templateUrl: './infrastructure-installation.component.html'
})
export class InfrastructureInstallationComponent implements OnInit {
  protected form: FormGroup;
  loading:boolean = false;
  @Input()
  projectStageCurrent?: ProjectStageDtoMock;
  @Input()
  isView = false;

  private project: ProjectMock = { id : 0 };
  protected infraInstallations: InfrastructureInstallationMock[] = [];
  private stageInfraInstallationsCurrent?: StageInfrastructureInstallationMock[];
  private stageCatalogDetailsCurrent?: StageCatalogDetail[];

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService,
              private readonly infrastructureInstallationService: InfrastructureInstallationService,
              protected readonly draftStore: ProjectStoreService) {
    this.form = this.buildForm();
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
  }

  ngOnInit(): void {
    this.loadData().subscribe(() => {
      this.initFeaturesDefinedFormGroup();
      this.initFeaturesProjectedFormGroup();
      if (this.isViewPage) {
        this.form.disable({ emitEvent: false });
        this.form.get('infra_features_defined')?.disable({ emitEvent: false });
        this.form.get('infra_features_projected')?.disable({ emitEvent: false });
      }
    });
  }

  private buildForm(): FormGroup {
    return this.fb.group({
        infra_features_defined : this.fb.array([]),
        infra_features_projected : this.fb.array([]),
        end_date: ['', [Validators.minLength(10) , Validators.maxLength(10)]],
        handover_date: ['', [Validators.minLength(10) , Validators.maxLength(10)]]
    });
  }

  private resetForm(): void {
    this.form.reset({
      end_date: this.project.projectStages?.at(0)?.endDate,
      handover_date: this.project.projectStages?.at(0)?.handOverDate
    })
  }

  private initFeaturesDefinedFormGroup(): void {
    const infraFeaturesFormArray = this.infraFeaturesDefinedFormArray;
    infraFeaturesFormArray.clear();
    console.log('evaluating each element of defined', this.infraInstallationsDefined);
    this.infraInstallationsDefined.forEach(feature => {
      const stageInfraFeature =
        this.stageInfraInstallationsCurrent?.find(sii => sii?.infraInstallation?.id === feature.id);
      console.log('feature_defined', feature);
      infraFeaturesFormArray.push(
        this.fb.group({
          reference: feature,
          value: [{ value: stageInfraFeature?.fieldValue ?? '' , disabled: false }, Validators.required],
        })
      );
    });
  }

  private initFeaturesProjectedFormGroup(): void {
    const infraFeaturesFormArray = this.infraFeaturesProjectedFormArray;
    infraFeaturesFormArray.clear();
    this.infraInstallationsProjected.forEach(feature => {
      const stageCatalogDetail = this.stageCatalogDetailsCurrent?.
      find(scd => feature?.id === scd.infraInstallation?.id);

      const formGroup = this.fb.group({
        reference: feature,
        status:  [stageCatalogDetail?.situation ?? '', Validators.required],
        type:    [ stageCatalogDetail?.catalogDetail?.id ?? undefined, Validators.required]
      });
      this.changesValueStatusProjectedFormGroup(formGroup);
      infraFeaturesFormArray.push(formGroup);
    });
  }

  changesValueStatusProjectedFormGroup(formGroup: FormGroup): void {
    const statusControl = formGroup.get('status');
    const typeControl = formGroup.get('type');

    const updateTypeState = (selected: any) => {
      if (selected === 'MISSING') {
        typeControl!.disable({ emitEvent: false });
        typeControl!.setValue(undefined, { emitEvent: false });
        typeControl!.clearValidators();
        typeControl!.markAsPristine({ onlySelf: true });
        typeControl!.markAsUntouched({ onlySelf: true });
      } else {
        typeControl!.enable({ emitEvent: false });
        typeControl!.setValidators(Validators.required);
      }
      typeControl!.updateValueAndValidity({ emitEvent: false });
    };

    statusControl!.valueChanges.subscribe(updateTypeState);
    updateTypeState(statusControl!.value);
  }

  isVisibleTypeFeatureProjected(infra: InfrastructureInstallationMock, idx: number): boolean | undefined {
    return (infra?.catalog && infra?.catalog?.catalogDetails
      && infra?.catalog?.catalogDetails!!.length > 0
      && (this.projectedStatusControl(idx)?.value && this.projectedStatusControl(idx)?.value !== 'MISSING'));
  }

  get infraFeaturesDefinedFormArray(): FormArray<FormGroup> {
    return this.form.get('infra_features_defined') as FormArray<FormGroup>;
  }

  get infraFeaturesProjectedFormArray(): FormArray<FormGroup> {
    return this.form.get('infra_features_projected') as FormArray<FormGroup>;
  }

  get fieldInfraFeatureDefinedControl() {
    return (idx: number)  => {
      return this.infraFeaturesDefinedFormArray
        .at(idx)
        .get('value');
    }
  }

  get projectedStatusControl() {
    return (idx: number) => {
      return this.infraFeaturesProjectedFormArray
        .at(idx)
        .get('status');
    }
  }

  isProjectedStatusInvalid(idx: number): boolean {
    const ctrl = this.infraFeaturesProjectedFormArray
      .at(idx)
      .get('status');
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  get projectedTypeControl() {
    return (idx: number) => {
      return this.infraFeaturesProjectedFormArray
        .at(idx)
        .get('type');
    }
  }

  isProjectedTypeInvalid(idx: number): boolean {
    const ctrl = this.infraFeaturesProjectedFormArray
      .at(idx)
      .get('type');
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }


  toGoSection1(): void {
    this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/section1`], {state: {project: this.project}});
  }

  back():void {
    this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/section2`], {state: {project: this.project}});
  }

  onSubmit(): void {
    if (this.projectStageCurrent) {
      this.save();
    } else {
      this.next();
    }
  }

  save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar los datos de la sección?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.captureData();
            this.projectService.save(this.project)
              .pipe(finalize(() => this.loadingService.hide()))
              .subscribe(project => {
                this.project = project;
              });
          }, 200);
        }
      });
  }

  next(): void {
    if(this.isViewPage) {
      this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/complementary`], {state: {project: this.project}});
      return;
    }

    console.log(this.form.value);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form Invalid", this.form);
      return;
    }
    setTimeout(() => {
      this.loadingService.show()
      this.captureData();
      this.projectService.updateDraft(this.project, '10449080004')
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe(project => {
          this.project = project;
          this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/complementary`], {state: {project: this.project}});
        });
    }, 0);
  }

  isListForInfra(infra: InfrastructureInstallationMock): boolean {
    return infra.dataType == InstallationDataType.LIST;
  }

  isBooleanForInfra(infra: InfrastructureInstallationMock): boolean {
    return infra.dataType == InstallationDataType.BOOLEAN;
  }

  get infraInstallationsDefined(): InfrastructureInstallationMock[]  {
      return this.infraInstallations
        .filter(infra => infra.installationType == InstallationType.DEFINED) ;
  }

  get infraInstallationsProjected(): InfrastructureInstallationMock[]  {
    return this.infraInstallations
      .filter(infra => infra.installationType == InstallationType.PROJECTED) ;
  }

  private captureData(): void {
    const stageInfrastructureInstallations: StageInfrastructureInstallationMock[] = [];
    const stageCatalogDetails: StageCatalogDetail[] = [];
    this.form.get('infra_features_defined')?.value.forEach((stageInfra: any) =>
      stageInfrastructureInstallations.push({
        infraInstallation: stageInfra.reference,
        fieldValue: stageInfra.value
      }));
    this.form.get('infra_features_projected')?.value.forEach((stageCatalogDetail: any) =>
      stageCatalogDetails.push({
        situation: stageCatalogDetail.status,
        catalogDetail: stageCatalogDetail.reference.catalog.catalogDetails
          .find((catalogDetail: CatalogDetailMock) => catalogDetail.id === stageCatalogDetail.type),
        infraInstallation: stageCatalogDetail.reference
      })
    );
    this.project.projectStages?.forEach((stage: ProjectStageMock) => {
      stage.stageInfraInstallations = stageInfrastructureInstallations;
      stage.stageCatalogDetails = stageCatalogDetails;
      stage.endDate = this.form.get('end_date')?.value;
      stage.handOverDate = this.form.get('handover_date')?.value;
    });
  }

  private loadData(): Observable<void> {
    this.loadingService.show();

    const draft$ = this.projectService.readDraft('10449080004', this.project);
    const infraInstallations$ = this.infrastructureInstallationService.readAll();

    return forkJoin([draft$, infraInstallations$]).pipe(
      tap(([project, infraInstallations]) => {
        this.project = project as ProjectMock;

        if (this.project?.projectStages?.length) {
          const stage = this.project.projectStages[0];
          this.stageInfraInstallationsCurrent = stage.stageInfraInstallations;
          this.stageCatalogDetailsCurrent = stage.stageCatalogDetails;
          this.resetForm();
        }

        this.infraInstallations = infraInstallations;
        console.log('get read all', this.infraInstallations);
      }),
      finalize(() => this.loadingService.hide()),
      map(() => void 0)
    );
  }

  get isViewPage() {
    return this.draftStore.draftStatus() == ProjectDraftStatus.VIEW || this.isView;
  }

}
