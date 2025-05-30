import {PropertyGroupMock} from './property-group.mock.model';
import {ProjectStageMock} from './project-stage.mock.model';
import {Document} from './document.mock.model';

export interface StagePropertyGroupDtoMock {
  propertyGroup?: PropertyGroupMock;
  stage?: ProjectStageMock;
  creationDate?: Date;
  // --- de property_group_document
  architecturalBluetprint?: Document;
  formatTemplateLoaded?: Document;
}
