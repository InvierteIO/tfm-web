import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FeatureMock} from '../../shared/models/feature.mock.model';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-land-property-features',
  imports: [
    IsInvalidFieldPipe,
    FormErrorMessagesPipe,
    SelectStyleDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './land-property-features.component.html'
})
export class LandPropertyFeaturesComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) landFeatures!: FeatureMock[] ;
}
