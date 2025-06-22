import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {NgForOf, NgIf} from '@angular/common';
import {FinancialBonusMockModel} from '../../shared/models/financial-bonus.mock.model';
import {DataType} from '../../shared/models/data-type.model';
import {AdditionalInformationComponent} from './additional-information.component';
import {BankMock} from '../../shared/models/bank.mock.model';
import {StagePropertyGroupDtoMock} from '../../shared/models/stage-property-group.dto.mock.model';
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from "@common/dialogs/dialogs-swal.constants";
import {IsInvalidFieldPipe} from "@common/pipes/is-invalid-field.pipe";
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {LoadingService} from '@core/services/loading.service';
import { SectionOneService } from './section-one.service';
import {Project} from "@core/models/project.model";
import {Observable, throwError, of} from "rxjs";
import { catchError, concatMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-section-one',
  imports: [
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    ButtonLoadingComponent,
    NgForOf,
    NgIf,
    AdditionalInformationComponent,
    IsInvalidFieldPipe,
    FileDropzoneComponent
  ],
  templateUrl: './section-one.component.html'
})
export class SectionOneComponent  implements OnInit  {
  public form: FormGroup;
  loading:boolean = false;
  financialsBonus: FinancialBonusMockModel[] = [];
  banks: BankMock[] = [];
  stagesPropertyTypes: StagePropertyGroupDtoMock[]= [];

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService,
              private readonly sectionOneService: SectionOneService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    setTimeout(() => {
      //this.loadData();
      this.initBonusesForm();
      this.initBanksForm();
    }, 500);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(100)]],
      office_address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      office_number: ['', [Validators.maxLength(6)]],
      supervisor: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      stages: ['', [Validators.required,  Validators.min(1), Validators.max(5), Validators.pattern('^[1-5]$')]],
      bonuses: this.fb.array([]),
      banks: this.fb.array([])
    });
  }

  public next(): void {
    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);
    this.loadingService.show();
    this.createProject();
  }

  private createProject(): void {
    const name = this.form.get('project_name')?.value;
    const officeAddress = this.form.get('office_address')?.value;
    const officeNumber = this.form.get('office_number')?.value;
    const supervisor = this.form.get('supervisor')?.value;
    const stages = this.form.get('stages')?.value;
    const taxIdentificationNumber = '10449080004';

    const projectDto: Project = {
      name: name,
      officeAddress: officeAddress,
      officeNumber: officeNumber,
      supervisor: supervisor,
      stages: stages
    };

    this.sectionOneService.createProject(projectDto, taxIdentificationNumber)
    .subscribe({
      next: () => {
        this.router.navigate(['/public/home/project-new/infrastructure-installation']);
      },
      error: (err) => {
        console.error('Error during project creation:', err);
      }
    });

    this.loadingService.hide();

  }

  private initBonusesForm(): void {
    const bonusesFormArray = this.form.get('bonuses') as FormArray;
    bonusesFormArray.clear();

    this.financialsBonus.forEach(bonus => {
      const typesFormArray = this.fb.array(
        bonus.types.map(t =>
          this.fb.group({
            id:    [t.id],
            name:  [`bonustype_${t.id}`],
            value: [{ value: '', disabled: true },
              t.required ? Validators.required : []
            ]
          })
        ));

      bonusesFormArray.push(
        this.fb.group({
          id:      [bonus.id],
          name:    [`bonus_${bonus.id}`],
          checked: [false],
          types:   typesFormArray
        }));
    });
  }

  private initBanksForm(): void {
    const banksFormArray = this.form.get('banks') as FormArray;
    banksFormArray.clear();

    this.banks.forEach(bonus => {
      banksFormArray.push(
        this.fb.group({
          id:      [bonus.id],
          name:    [`bank_${bonus.id}`],
          checked: [false],
          account:   this.fb.group({
            name:  [`account_${bonus.id}`],
            value: [{ value: '', disabled: true }, Validators.required]
          }),
          cci:   this.fb.group({
            name:  [`cci_${bonus.id}`],
            value: [{ value: '', disabled: true }, Validators.required]
          })
        })
      );
    });
  }

  toGoPropertyType(propertyType: StagePropertyGroupDtoMock | undefined):void {
    // Debe validarse que este el campo: stage
    if(!this.form?.get("stages")?.valid) {
      Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("Número de etapas sin definir"))
        .then(r => {}) ;
      return;
    }
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/property-type'], { state:  { property_type: propertyType } });
      this.loadingService.hide();
      }, 1000);
  }

  get isShowTable() {
    return !this.stagesPropertyTypes || this.stagesPropertyTypes.length === 0;
  }


  deletePropertyType(propertyType: StagePropertyGroupDtoMock):void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.stagesPropertyTypes.splice(this.stagesPropertyTypes.indexOf(propertyType), 1);
            this.loadingService.hide();
            }, 2000);
        }
      });
  }

  duplicatePropertyType(propertyType: StagePropertyGroupDtoMock):void {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea duplicar el tipo de inmueble?"))
      .then(r => {}) ;
  }

  toGoProperties(propertyType: StagePropertyGroupDtoMock) : void {
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/properties'], { state:  { property_type: propertyType } });
      this.loadingService.hide();
    }, 1000);
  }

  onDropFile(event: DragEvent, type: 'architectural' | 'template',
             typesProperty: StagePropertyGroupDtoMock): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] en fila ${typesProperty.propertyGroup?.name}:`,
        file.name, file.type);

      this.loadingService.show();
      setTimeout(() => { this.loadingService.hide(); }, 1000);
    }
  }


  onFileSelected(event: Event, type: 'architectural' | 'template',
                 typesProperty: StagePropertyGroupDtoMock): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] en fila ${typesProperty.propertyGroup?.name}:`, file.name, file.type);
      input.value = '';

      this.loadingService.show();
      setTimeout(() => { this.loadingService.hide(); }, 1000);
    }
  }

  loadData(): void {
    this.financialsBonus = [ {
      id: 1, name : "Techo Propio",
      types : [{
        id:1, name : "Numero", dataType: DataType.TEXT, required: true
      }]
    },
      {
        id: 2, name : "Crédito",
        types : [{
          id:2, name : "Bono pagador", dataType: DataType.BOOLEAN, required: false
        },
          {
            id:3, name : "Bono verde", dataType: DataType.BOOLEAN, required: true
          }]
      }];

    this.banks = [
      { id: 1, name : "BCP"},
      { id: 2, name : "BBVA"},
      { id: 3, name : "INTERBANK"},
      { id: 4, name : "MI BANCO"}
    ];

    this.stagesPropertyTypes = [{
     stage : {
       id: 1, stage: "I"
     },
      propertyGroup: {
       name: "Tipo 1 - Departamento"
      }
    },
      {
        stage : {
          id: 2, stage: "II"
        },
        propertyGroup: {
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:1,
          name:"Plano 1"
        }
      },
      {
        stage : {
          id: 3, stage: "I"
        },
        propertyGroup: {
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:2,
          name:"Plano 2"
        },
        formatTemplateLoaded: {
          id:3,
          name:"Plantilla llenado"
        }
      }];
  }
}
