import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormUtil} from '@common/utils/form.util';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {NgForOf, NgIf} from '@angular/common';
import {FinancialBonusMock} from '../../shared/models/financial-bonus.mock';
import {DataType} from '../../shared/models/data-type.model';
import {AdditionalInformationComponent} from './additional-information.component';
import {BankMock} from '../../shared/models/bank.mock.model';
import {StagePropertyGroupMock} from '../../shared/models/stage-property-group.mock.model';

@Component({
  selector: 'app-section-one',
  imports: [
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    ButtonLoadingComponent,
    NgForOf,
    NgIf,
    AdditionalInformationComponent
  ],
  templateUrl: './section-one.component.html',
  styleUrl: './section-one.component.css'
})
export class SectionOneComponent  implements OnInit  {
  public form: FormGroup;
  loading:boolean = false;
  financialsBonus: FinancialBonusMock[] = [];
  banks: BankMock[] = [];
  stagesTypesProperty: StagePropertyGroupMock[]= [];

  constructor(private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    // Simulación asíncrona de carga
    setTimeout(() => {
      this.setData();
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

  get isFieldNotValid() {
    return (field: string) =>
      this.form?.get(field)?.invalid && this.form?.get(field)?.touched;
  }

  public next(): void {
    console.log(this.form);
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);
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

  get isShowTable() {
    return !this.stagesTypesProperty || this.stagesTypesProperty.length === 0;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const el = (event.currentTarget as HTMLElement);
    el.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const el = (event.currentTarget as HTMLElement);
    el.classList.remove('dragover');
  }

  onDropFile(event: DragEvent, type: 'architectural' | 'template',
             typesProperty: StagePropertyGroupMock): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] en fila ${typesProperty.propertyGroup?.name}:`,
        file.name, file.type);
    }
  }


  onFileSelected(event: Event, type: 'architectural' | 'template',
                 typesProperty: StagePropertyGroupMock): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] en fila ${typesProperty.propertyGroup?.name}:`, file.name, file.type);
      input.value = '';
    }
  }

  setData(): void {
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

    this.stagesTypesProperty = [{
     stage : {
       id: 1, stage: "I"
     },
      propertyGroup: {
       name: "Tipo 1 - Departamento"
      }
    },
      {
        stage : {
          id: 2, stage: "I"
        },
        propertyGroup: {
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:1,
          name:"Plano 1"
        }
      }];
  }
}
