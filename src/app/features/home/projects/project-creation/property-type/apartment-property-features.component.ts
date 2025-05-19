import {Component, Input} from '@angular/core';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {FeatureMock} from '../../shared/models/feature.mock.model';

@Component({
  selector: 'app-apartment-property-features',
  imports: [
    FormErrorMessagesPipe,
    FormsModule,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SelectStyleDirective
  ],
  templateUrl: './apartment-property-features.component.html'
})
export class ApartmentPropertyFeaturesComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) apartmentFeatures!: FeatureMock[] ;
}
