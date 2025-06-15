import {PropertyGroupMock} from './property-group.mock.model';
import {HouseFloorAreaMock} from './house-floor-area.mock.model';

export interface PropertyGroupHouseMock extends PropertyGroupMock {
  roofedArea?: number;
  totalBathrooms?: number;
  totalRooms?: number;
  totalFloors?: number;
  blockLocation?: string;
  roadWay?: string;
  houseFloorAreas?: HouseFloorAreaMock[];
}
