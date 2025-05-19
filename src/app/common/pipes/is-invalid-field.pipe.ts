import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl }     from '@angular/forms';

@Pipe({
  name: 'isInvalidField', standalone: true,
  pure: false
})
export class IsInvalidFieldPipe implements PipeTransform {
  transform(control: AbstractControl | null): boolean {
    if (!control) {
      return false;
    }
    return control.invalid && control.touched;
  }
}
