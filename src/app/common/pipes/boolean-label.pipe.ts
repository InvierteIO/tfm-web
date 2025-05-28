import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'booleanLabel', standalone: true })
export class BooleanLabelPipe implements PipeTransform {
  transform(
    value: boolean | null | undefined,
    options: Partial<{ true: string; false: string; null: string }> = {}
  ): string {
    const lbl = { true: 'SI', false: 'NO', null: '', ...options };
    if (value === true) return lbl.true;
    if (value === false) return lbl.false;
    return lbl.null;
  }
}
