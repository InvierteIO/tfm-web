import {PropertyGroupMock} from './property-group.mock.model';
import {ProjectStageMock} from './project-stage.mock.model';
import {DocumentMock} from './document.mock.model';
import {PropertyMock} from '../../../shared/models/property.mock.model';

export interface StagePropertyGroupDtoMock {
  id?: number;
  propertyGroup?: PropertyGroupMock;
  stage?: ProjectStageMock;
  creationDate?: Date;
  // --- de property_group_document
  properties?: PropertyMock[];
  propertyGroupDocuments?: DocumentMock[];
  architecturalBluetprint?: DocumentMock;
  formatTemplateLoaded?: DocumentMock;
}
