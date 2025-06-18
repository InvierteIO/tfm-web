import {PropertyMock} from '../../../../shared/models/property.mock.model';
import {FormGroup} from '@angular/forms';

export interface PropertyRow {
  property: PropertyMock;
  form: FormGroup;
  editing: boolean;
  isNew: boolean;
  original?: PropertyMock;
}
