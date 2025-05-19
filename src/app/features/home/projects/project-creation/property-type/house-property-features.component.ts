import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeatureMock} from '../../shared/models/feature.mock.model';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {positiveNumberValidator} from '@common/validators/positive-number.validator';

@Component({
  selector: 'app-house-property-features',
  imports: [
    FormErrorMessagesPipe,
    FormsModule,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectStyleDirective
  ],
  templateUrl: './house-property-features.component.html'
})
export class HousePropertyFeaturesComponent implements OnInit{
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) houseFeatures!: FeatureMock[];

   constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup.get('house_total_floors')!
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((floors: number) => this.syncFloorAreas(floors));
  }

  private syncFloorAreas(floors: number | null): void {
    const fa = this.houseFloorAreas;

    const qty = Math.max(0, Math.min(Number(floors) || 0, 10));

    while (fa.length < qty) {
      fa.push(
        this.fb.group({
          value: ['', [Validators.required, positiveNumberValidator(true)]]
        })
      );
    }

    while (fa.length > qty) {
      fa.removeAt(fa.length - 1);
    }
  }

  get houseFloorAreas(): FormArray {
    return this.formGroup.get('house_floor_areas') as FormArray;
  }


  get isFieldFloorHouseNotValid() {
    return (idx: number) => {
      const ctrl = this.houseFloorAreas.at(idx).get('value');
      return !!ctrl && ctrl.invalid && ctrl.touched;
    }
  }
}
