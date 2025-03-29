import { FormGroup } from '@angular/forms';

export class FormUtil {
  static markAllAsTouched(form: FormGroup): void {
    Object.values(form.controls).forEach(control => {
      if (control instanceof FormGroup) {
        FormUtil.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
