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
import {FinancialBonusMockModel} from '../../shared/models/financial-bonus.mock.model';
import {BankMock} from '../../shared/models/bank.mock.model';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {Router} from '@angular/router';
import {LoadingService} from '@core/services/loading.service';
import {FormUtil} from '@common/utils/form.util';
import {DataType} from '../../shared/models/data-type.model';
import {PropertyGroupMock} from '../../shared/models/property-group.mock.model';
import {ProjectService} from '../../shared/services/project.service';
import {finalize} from 'rxjs/operators';

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
  loading:boolean = false;
  financialsBonus: FinancialBonusMockModel[] = [];
  banks: BankMock[] = [];
  public project: ProjectMock = { id : 0 };

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
    this.loadingService.show();
    this.projectService.readDraft()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe((project ) => this.project = project as ProjectMock);

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
