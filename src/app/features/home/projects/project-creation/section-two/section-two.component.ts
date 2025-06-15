import {Component, OnInit} from '@angular/core';
import {AdditionalInformationComponent} from './additional-information.component';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {
  ProjectPropertyTypesComponent
} from '../../shared/components/project-property-types/project-property-types.component';
import {FinancialBonusMock} from '../../shared/models/financial-bonus.mock';
import {BankMock} from '../../shared/models/bank.mock.model';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {Router} from '@angular/router';
import {LoadingService} from '@core/services/loading.service';
import {FormUtil} from '@common/utils/form.util';
import {DataType} from '../../shared/models/data-type.model';
import {PropertyGroupMock} from '../../shared/models/property-group.mock.model';
import {ProjectService} from '../../shared/services/project.service';
import {finalize} from 'rxjs/operators';
import {StageBankMock} from '../../shared/models/stage-bank.mock.model';
import {StageBonusTypeMock} from '../../shared/models/stage-bonus-type.mock.model';
import {ProjectStageMock} from '../../shared/models/project-stage.mock.model';
import {FinancialBonusTypeMock} from '../../shared/models/financial-bonus-type.mock';

@Component({
  selector: 'app-section-two',
  imports: [
    AdditionalInformationComponent,
    ButtonLoadingComponent,
    FormsModule,
    ProjectPropertyTypesComponent,
    ReactiveFormsModule
  ],
  templateUrl: './section-two.component.html'
})
export class SectionTwoComponent implements OnInit  {
  public form: FormGroup;
  public project: ProjectMock = { id : 0 };
  loading:boolean = false;
  financialsBonus: FinancialBonusMock[] = [];
  banks: BankMock[] = [];
  stageBanksCurrent?: StageBankMock[];
  stageBonusTypesCurrent?: StageBonusTypeMock[];

  constructor(private readonly  router: Router,
              private readonly fb: FormBuilder,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    this.loadData();
    this.initBonusesForm();
    this.initBanksForm();
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

  next(): void {
    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    console.log(this.form.value);

    this.loadingService.show();
    setTimeout(() => {
      this.captureData();
      this.projectService.save(this.project)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe(project => {
          this.router.navigate(['/public/home/project-new/infrastructure-installation']);
          this.project = project;
        });
    }, 50);
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

    this.project.projectStages?.forEach((stage: ProjectStageMock) => {
      stage.stageBanks = stagesBanks;
      stage.stageBonusTypes = stageBonuseTypes;
    });
  }

  private loadData(): void {
    this.loadingService.show();
    this.projectService.readDraft()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((project ) => {
        this.project = project as ProjectMock;
        if(this.project && this.project.projectStages && this.project.projectStages.length > 0) {
          this.stageBonusTypesCurrent = this.project.projectStages?.at(0)!.stageBonusTypes;
          this.stageBanksCurrent = this.project.projectStages?.at(0)!.stageBanks;
        }
      });

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
