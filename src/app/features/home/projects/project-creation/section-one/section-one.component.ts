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
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from "@common/dialogs/dialogs-swal.constants";
import {IsInvalidFieldPipe} from "@common/pipes/is-invalid-field.pipe";
import {LoadingService} from '@core/services/loading.service';
import {ProjectPropertyTypesComponent} from '../../shared/components/project-property-types/project-property-types.component';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {StagePropertyGroupDtoMock} from '../../shared/models/stage-property-group.dto.mock.model';
import {PropertyGroupMock} from '../../shared/models/property-group.mock.model';

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
    ProjectPropertyTypesComponent
  ],
  templateUrl: './section-one.component.html'
})
export class SectionOneComponent  implements OnInit  {
  public form: FormGroup;
  loading:boolean = false;
  financialsBonus: FinancialBonusMockModel[] = [];
  banks: BankMock[] = [];
  public project: ProjectMock = { id : 0 };

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    setTimeout(() => {
      this.loadData();
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
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/infrastructure-installation']);
      this.loadingService.hide();
    }, 50);
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
  }

  toGoPropertyType(propertyType?: PropertyGroupMock): void {
    // Debe validarse que este el campo: stage
    if(!this.form?.get("stages")?.valid) {
      Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("Número de etapas sin definir"))
        .then(r => {}) ;
      return;
    }

    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/property-type'], { state: { property_type: propertyType } });
      this.loadingService.hide();
    }, 1000);
  }
}
