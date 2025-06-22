import {PropertyCategory} from '../../../../shared/models/property-category.model';
import {PropertyFeatureMock} from './property-feature.mock.model';
import {StagePropertyGroupDtoMock} from './stage-property-group.dto.mock.model';

export interface PropertyGroupMock {
  id?: number;
  name?: string;
  perimeter?: number;
  area?: number;
  parkingSpace?: boolean;
  frontPark?: boolean;
  currency?: string;
  price?: number;
  annualInterestRate?: number;
  propertyCategory?: PropertyCategory;
  propertyFeatures?: PropertyFeatureMock[];
  stagePropertyGroups?: StagePropertyGroupDtoMock[];
}
