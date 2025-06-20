import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProjectMock} from '../../../shared/models/project.mock.model';
import {FinancialBonusMock} from '../../../shared/models/financial-bonus.mock';
import {BankMock} from '../../../shared/models/bank.mock.model';
import {StageBankMock} from '../../../shared/models/stage-bank.mock.model';
import {StageBonusTypeMock} from '../../../shared/models/stage-bonus-type.mock.model';
import {Router} from '@angular/router';
import {ProjectService} from '../../../shared/services/project.service';
import {LoadingService} from '@core/services/loading.service';
import {FormUtil} from '@common/utils/form.util';
import {finalize} from 'rxjs/operators';
import {ProjectStageMock} from '../../../shared/models/project-stage.mock.model';
import {DataType} from '../../../shared/models/data-type.model';
import {
  AdditionalInformationComponent
} from '../../../shared/components/additional-information/additional-information.component';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

@Component({
  selector: 'app-project-stage-info-bonus-bank',
  imports: [
    AdditionalInformationComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonLoadingComponent
  ],
  templateUrl: './project-stage-info-bonus-bank.component.html'
})
export class ProjectStageInfoBonusBankComponent implements OnInit{
  public form: FormGroup;
  loading:boolean = false;
  financialsBonus: FinancialBonusMock[] = [];
  banks: BankMock[] = [];
  stageBanksCurrent?: StageBankMock[];
  stageBonusTypesCurrent?: StageBonusTypeMock[];
  @Input()
  isView = false;

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    this.loadData();
    this.initBonusesForm();
    this.initBanksForm();

    if(this.isView) {
      this.form.disable({ emitEvent: false });
      this.form.get('bonuses')?.disable({ emitEvent: false });
      this.form.get('banks')?.disable({ emitEvent: false });
    }
  }


  private buildForm(): FormGroup {
    return this.fb.group({
      bonuses: this.fb.array([]),
      banks: this.fb.array([])
    });
  }

  toGoSection1(): void {
    this.router.navigate(['/public/home/project-new/section1']);
  }

  save(): void {
    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    console.log(this.form.value);

    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar la información de banca/bonus?"))
      .then((result) => {
        this.loadingService.hide();
        if (result.isConfirmed) {
          this.captureData();
        }
      });
  }

  private initBonusesForm(): void {
    const bonusesFormArray = this.form.get('bonuses') as FormArray;
    bonusesFormArray.clear();

    this.financialsBonus.forEach(bonus => {
      const typesFormArray = this.fb.array(
        bonus.types.map(t => {
          const stageType = this.stageBonusTypesCurrent?.find(sbt => sbt.financialBonusType?.id === t.id);
          return this.fb.group({
            reference: t,
            value: [{ value: stageType?.typeValue ?? '', disabled: !stageType },
              t.required ? Validators.required : []
            ]
          });
        }));

      const checked = bonus.types.some(t =>
        this.stageBonusTypesCurrent?.some(sbt => sbt.financialBonusType?.id === t.id)
      );

      bonusesFormArray.push(
        this.fb.group({
          reference: bonus,
          checked: [checked],
          types:   typesFormArray
        }));
    });
  }

  private initBanksForm(): void {
    const banksFormArray = this.form.get('banks') as FormArray;
    banksFormArray.clear();

    this.banks.forEach(bank => {
      const stageBank = this.stageBanksCurrent?.find(sb => sb.bank?.id === bank.id);

      banksFormArray.push(
        this.fb.group({
          reference: bank,
          checked: [!!stageBank],
          account:   this.fb.group({
            value: [{ value: stageBank?.accountNumber ?? '', disabled: !stageBank }, Validators.required]
          }),
          cci:   this.fb.group({
            value: [{ value: stageBank?.interbankAccountNumber ?? '', disabled: !stageBank }, Validators.required]
          })
        })
      );
    });
  }

  private captureData():void {
    let stagesBanks: StageBankMock[] = [];
    let stageBonuseTypes: StageBonusTypeMock[] = [];
    this.form.get('banks')?.value.forEach((stageBank: any) => {
      if(stageBank.checked === true) {
        stagesBanks.push({
          bank : stageBank.reference,
          accountNumber: stageBank.account.value,
          interbankAccountNumber: stageBank.cci.value,
          currency: "PEN"
        });
      }
    });
    this.form.get('bonuses')?.value.forEach((stageBonus: any) => {
      if(stageBonus.checked === true) {
        stageBonus.types.forEach((bonusType: any) => {
          stageBonuseTypes.push({
            financialBonusType: bonusType.reference,
            typeValue: bonusType.value,
          });
        })
      }
    });
  }

  private loadData(): void {
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

}
