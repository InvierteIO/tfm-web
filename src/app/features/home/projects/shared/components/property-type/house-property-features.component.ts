import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FeatureMock} from '../../models/feature.mock.model';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {positiveNumberValidator} from '@common/validators/positive-number.validator';
import {HouseFloorAreaMock} from '../../models/house-floor-area.mock.model';
import {ProjectStoreService} from '../../services/project-store.service';

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
  @Input({ required: true }) houseFloorAreasValues!: HouseFloorAreaMock[];
  @Input() isView: boolean = false;
   constructor(protected readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildInitFloorAreas();
    if (this.isView)
      this.formGroup.disable({ emitEvent: false });

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
    const diff = qty - fa.length;

    if (diff > 0) {
      const start = fa.length;
      Array.from({ length: diff }, (_, i) =>
        this.fb.group({
          value: ['', [Validators.required, positiveNumberValidator(true)]],
          number: start + i + 1
        })
      ).forEach(ctrl => fa.push(ctrl));
    }

    if (diff < 0)
      Array.from({ length: -diff }).forEach(() => fa.removeAt(fa.length - 1));
  }

  private buildInitFloorAreas(): void {
    if (this.houseFloorAreasValues?.length && this.houseFloorAreasValues.length > 0) {
      this.houseFloorAreasValues.forEach(({area, number}) =>
        this.houseFloorAreas.push(
          this.fb.group({
            value: [area, [Validators.required, positiveNumberValidator(true)]],
            number
          })
        )
      );
    } else {
      this.syncFloorAreas(this.formGroup.get('house_total_floors')!.value);
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
