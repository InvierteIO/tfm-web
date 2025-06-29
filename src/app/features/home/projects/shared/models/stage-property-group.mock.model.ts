import {PropertyGroupMock} from './property-group.mock.model';
import {ProjectStageMock} from './project-stage.mock.model';
import {DocumentMock} from './document.mock.model';

export interface StagePropertyGroupMock {
  propertyGroup?: PropertyGroupMock;
  stage?: ProjectStageMock;
  creationDate?: Date
  propertyGroupDocuments?: DocumentMock[];
}
