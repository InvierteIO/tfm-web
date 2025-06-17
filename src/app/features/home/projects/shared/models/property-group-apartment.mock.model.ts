import {PropertyGroupMock} from './property-group.mock.model';

export interface PropertyGroupApartmentMock extends PropertyGroupMock {
  totalBathrooms?: number;
  totalRooms?: number;
  type?: string;
  areaFloorOne?: number;
  areaFloorTwo?: number;
  areaFloorThree?: number;
  towerLocation?: string;
}
