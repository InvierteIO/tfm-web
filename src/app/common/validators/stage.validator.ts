import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stageRomanValidator(): ValidatorFn {
  const allowedValues = ['I', 'II', 'III', 'IV', 'V'];
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !allowedValues.includes(value)) {
      return { invalidStage: true };
    }
    return null;
  };
}
