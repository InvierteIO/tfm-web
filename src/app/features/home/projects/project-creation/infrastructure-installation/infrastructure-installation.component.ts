import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {InfraestructureInstallationMock} from '../../shared/models/infraestructure-installation.mock';
import {InstallationType} from '../../shared/models/installation-data.type';
import {InstallationDataType} from '../../shared/models/installation-type.model';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import {LoadingService} from '@core/services/loading.service';

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
    ButtonLoadingComponent
  ],
  templateUrl: './infrastructure-installation.component.html'
})
export class InfrastructureInstallationComponent implements OnInit {
  protected form: FormGroup;
  loading:boolean = false;
  protected infraInstallations: InfraestructureInstallationMock[] = [];

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.initFeaturesDefinedFormGroup();
    this.initFeaturesProjectedFormGroup();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
        infra_features_defined : this.fb.array([]),
        infra_features_projected : this.fb.array([]),
        end_date: ['', [Validators.minLength(10) , Validators.maxLength(10)]],
        handover_date: ['', [Validators.minLength(10) , Validators.maxLength(10)]]
    });
  }

  private initFeaturesDefinedFormGroup(): void {
    const infraFeaturesFormArray = this.infraFeaturesDefinedFormArray;
    infraFeaturesFormArray.clear();

    this.infraInstallationsDefined.forEach(features => {
      infraFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          data_type: features.dataType,
          value:    [{ value: '', disabled: false }, Validators.required],
        })
      );
    });
  }

  private initFeaturesProjectedFormGroup(): void {
    const infraFeaturesFormArray = this.infraFeaturesProjectedFormArray;
    infraFeaturesFormArray.clear();

    this.infraInstallationsProjected.forEach(features => {
      const formGroup = this.fb.group({
        id:      [features.id],
        status:  ['', Validators.required],
        type:    [undefined, Validators.required]
      });
      this.changesValueStatusProjectedFormGroup(formGroup);
      infraFeaturesFormArray.push(formGroup);
    });
  }

  changesValueStatusProjectedFormGroup(formGroup: FormGroup): void {
    formGroup.get('status')!.valueChanges.subscribe(selected => {
      const typeControl = formGroup.get('type');
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
    });
  }

  isVisibleTypeFeatureProjected(infra: InfraestructureInstallationMock, idx: number): boolean | undefined {
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
    this.router.navigate(['/public/home/project-new/section1']);
  }

  next(): void {
    console.log(this.form);
    console.log(this.form.value);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }

    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/complementary']);
      this.loadingService.hide();
      }, 500);
  }

  isListForInfra(infra: InfraestructureInstallationMock): boolean {
    return infra.dataType == InstallationDataType.LIST;
  }

  isBooleanForInfra(infra: InfraestructureInstallationMock): boolean {
    return infra.dataType == InstallationDataType.BOOLEAN;
  }

  get infraInstallationsDefined(): InfraestructureInstallationMock[]  {
      return this.infraInstallations
        .filter(infra => infra.installationType == InstallationType.DEFINED) ;
  }

  get infraInstallationsProjected(): InfraestructureInstallationMock[]  {
    return this.infraInstallations
      .filter(infra => infra.installationType == InstallationType.PROJECTED) ;
  }

  loadData(): void {
    this.infraInstallations = [
      {
        id : 1,
        code: "0001",
        name: "Tipo de pista",
        dataType: InstallationDataType.LIST,
        installationType: InstallationType.DEFINED,
        catalog: {
          id: 1,
          code: '0001',
          name: 'Tipo de pista para habilitacion',
          description: "Tipo de pista para las caracteristicas de habilitacion del proyecto",
          catalogDetails: [{
            id : 1,
            code: "00010001",
            name: 'Asta Hada',
          }, {
            id : 2,
            code: "00010002",
            name: 'Pavimento Rígido',
          }, {
            id : 3,
            code: "00010003",
            name: 'Adoquin',
          }, {
            id : 4,
            code: "00010003",
            name: 'No tiene',
          }]
        }
      },
      {
        id : 2,
        code: "0002",
        name: "Tuberías para internet",
        dataType: InstallationDataType.BOOLEAN,
        installationType: InstallationType.DEFINED
      },
      {
        id : 3,
        code: "0003",
        name: "A filo de Pista",
        dataType: InstallationDataType.BOOLEAN,
        installationType: InstallationType.DEFINED
      },
      {
        id : 4,
        code: "0004",
        name: "Acceso a pistas y vias expresas",
        dataType: InstallationDataType.BOOLEAN,
        installationType: InstallationType.DEFINED
      },
      {
        id : 5,
        code: "0005",
        name: "Vereda",
        dataType: InstallationDataType.BOOLEAN,
        installationType: InstallationType.DEFINED
      },
      {
        id : 6,
        code: "0006",
        name: "Redes electricas",
        dataType: InstallationDataType.LIST,
        installationType: InstallationType.PROJECTED,
        other: "¿Cuenta con redes eléctrica?",
        catalog: {
          id: 2,
          code: '0002',
          name: 'Redes eléctricas',
          description: "Redes eléctricas para las caracteristicas de habilitacion del proyecto",
          other: "Tipo de redes eléctricas",
          catalogDetails: [{
            id : 5,
            code: "00020001",
            name: 'Subterranea',
          }, {
            id : 6,
            code: "00020002",
            name: 'Aerea',
          }]
        }
      },
      {
        id : 7,
        code: "0007",
        name: "Abastecimiento de agua potable",
        dataType: InstallationDataType.LIST,
        installationType: InstallationType.PROJECTED,
        //other: undefined,
        catalog: {
          id: 3,
          code: '0003',
          name: 'Abastecimiento de agua potable',
          description: "Abastecimiento de agua potable para las caracteristicas de habilitacion del proyecto",
          other: "Tipo de abastecimiento de agua potable",
          catalogDetails: [{
            id : 7,
            code: "00030001",
            name: 'Tanque elevado',
          }, {
            id : 8,
            code: "00030002",
            name: 'Troncal existente',
          }]
        }
      },
      {
        id : 8,
        code: "0008",
        name: "Tratamiento de aguas Servidas / Negras",
        other: "Redes de desague o alcantarillado",
        dataType: InstallationDataType.LIST,
        installationType: InstallationType.PROJECTED,
        //other: undefined,
        catalog: {
          id: 4,
          code: '0004',
          name: 'recoleccion de aguas servidas / negras',
          description: "Abastecimiento de agua potable para las caracteristicas de habilitacion del proyecto",
          other: "Tipo de recolección de aguas servidas / Negras",
          catalogDetails: [{
            id : 9,
            code: "00040001",
            name: 'Tanque elevado',
          }, {
            id : 10,
            code: "00040002",
            name: 'Planta de tratamiento Propio',
          }, {
            id : 11,
            code: "00040003",
            name: 'Biogestores',
          }]
        }
      }
    ];
  }

}
