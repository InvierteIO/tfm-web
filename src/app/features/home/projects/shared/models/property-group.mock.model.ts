import {PropertyCategory} from '../../../../shared/models/property-category.model';

export interface PropertyGroupMock {
  id?: number;
  name?: string;
  perimeter?: number;
  area?: number;
  parkingSpace?: boolean;
  frontPark?: boolean;
  price?: number;
  annualInterestRate?: number;
  propertyCategory?: PropertyCategory;
}
