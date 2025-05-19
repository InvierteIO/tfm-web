import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export class FormUtil {

  static markAllAsTouched(control: AbstractControl): void {
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
      return;
    }
    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(child =>
        FormUtil.markAllAsTouched(child)
      );
      control.markAsTouched({ onlySelf: true });
    }
  }
}
