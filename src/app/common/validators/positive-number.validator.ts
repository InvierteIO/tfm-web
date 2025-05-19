import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveNumberValidator(allowZero = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (isNaN(num)) {
      return { notANumber: true };
    }
    if (allowZero) {
      return num < 0 ? { nonNegativeNumber: true } : null;
    } else {
      return num <= 0 ? { positiveNumber: true } : null;
    }
  };
}
