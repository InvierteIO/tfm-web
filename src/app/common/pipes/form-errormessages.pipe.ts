import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formErrorMessages',
  standalone: true,
  pure: false
})
export class FormErrorMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null, fieldName: string = ''): string[] {
    if (!control || !control.errors || !control.touched) return [];
    const errors: ValidationErrors = control.errors;
    const messages: string[] = [];

    if (errors['required']) {
      messages.push(`El campo ${fieldName} es obligatorio`);
    }
    if (errors['max']) {
      messages.push(`El campo ${fieldName} debe ser ≤ ${errors['max'].max}`);
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

    if (errors['positiveNumber']) {
      messages.push(`El campo ${fieldName} debe ser un número positivo > 0`);
    }
    if (errors['nonNegativeNumber']) {
      messages.push(`El campo ${fieldName} debe ser un número ≥ 0`);
    }
    if (errors['notANumber']) {
      messages.push(`El campo ${fieldName} debe ser un número válido`);
    }

    return messages;
  }
}
