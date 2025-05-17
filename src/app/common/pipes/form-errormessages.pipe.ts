import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formErrorMessages',
  standalone: true,
})
export class FormErrorMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null, fieldName: string = ''): string[] {
    if (!control || !control.errors || !control.touched) return [];
    const errors: ValidationErrors = control.errors;
    const messages: string[] = [];

    if (errors['required']) {
      messages.push(`El campo ${fieldName} es obligatorio`);
    }
    if (errors['maxlength']) {
      messages.push(`La longitud máxima es de ${errors['maxlength'].requiredLength} carácteres`);
    }
    if (errors['minlength']) {
      messages.push(`La longitud mínima es de ${errors['minlength'].requiredLength} carácteres`);
    }
    if (errors['pattern']) {
      messages.push(`El formato es inválido`);
    }

    return messages;
  }
}
