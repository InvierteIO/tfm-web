import {Component, Input} from '@angular/core';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FinancialBonusMock} from '../../models/financial-bonus.mock';
import {DataType} from '../../models/data-type.model';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {BankMock} from '../../models/bank.mock.model';
import {SelectStyleDirective} from "@common/directives/select-style.directive";

@Component({
  selector: 'app-additional-information',
    imports: [
        ReactiveFormsModule,
        FormErrorMessagesPipe,
        NgForOf,
        NgIf,
        SelectStyleDirective
    ],
  templateUrl: './additional-information.component.html'
})
export class AdditionalInformationComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) financialsBonus: FinancialBonusMock[] = [];
  @Input({ required: true }) banks: BankMock[] = [];
  protected readonly DATA_TYPE = DataType;

  get bonusesFormArray(): FormArray<FormGroup> {
    return this.form.get('bonuses') as FormArray<FormGroup>;
  }

  onBonusCheck(i: number): void {
    const bonusFormGroup   = this.bonusesFormArray.at(i) as FormGroup;
    const checked   = bonusFormGroup.get('checked')!.value;
    const typesFormArray   = bonusFormGroup.get('types') as FormArray;

    typesFormArray.controls.forEach(typeFormGroup => {
      const valueCtrl = (typeFormGroup as FormGroup).get('value')!;
      checked ? valueCtrl.enable() : valueCtrl.disable();
      if (!checked) valueCtrl.reset();
    });
  }

  isTypeInvalid(bonusIdx: number, typeIdx: number): boolean {
    const ctrl = (this.bonusesFormArray
      .at(bonusIdx)
      .get('types') as FormArray)
      .at(typeIdx)
      .get('value');
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  get fieldTypeControl() {
    return (bonusIdx: number, typeIdx: number)  => {
      return (this.bonusesFormArray
        .at(bonusIdx)
        .get('types') as FormArray)
        .at(typeIdx)
        .get('value');
    }
  }

  get banksFormArray(): FormArray<FormGroup> {
    return this.form.get('banks') as FormArray<FormGroup>;
  }

  onBankCheck(i: number): void {
    const bankFormGroup   = this.banksFormArray.at(i) as FormGroup;
    const checked   = bankFormGroup.get('checked')!.value;
    const valueCtrlAccount = bankFormGroup.get('account')?.get("value");
    checked ? valueCtrlAccount?.enable() : valueCtrlAccount?.disable();
    if (!checked) valueCtrlAccount?.reset();

    const valueCtrlCci = bankFormGroup.get('cci')?.get("value");
    checked ? valueCtrlCci?.enable() : valueCtrlCci?.disable();
    if (!checked) valueCtrlCci?.reset();
  }

  isFieldBankInvalid(bankIdx: number, field: 'account' | 'cci'): boolean {
    const ctrl = (this.banksFormArray
      .at(bankIdx).get(field) as FormGroup)
      .get('value');
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  get fieldBankControl() {
    return (bankIdx: number, field: 'account' | 'cci')  => {
      return (this.banksFormArray
        .at(bankIdx).get(field) as FormGroup)
        .get('value');
    }
  }
}
