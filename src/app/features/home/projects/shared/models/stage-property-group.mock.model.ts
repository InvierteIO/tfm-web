import {PropertyGroupMock} from './property-group.mock.model';
import {ProjectStageMock} from './project-stage.mock.model';
import {Document} from './document.mock.model';

export interface StagePropertyGroupMock {
  propertyGroup?: PropertyGroupMock;
  stage?: ProjectStageMock;
  creationDate?: Date;
  architecturalBluetprint?: Document;
  formatTemplateLoaded?: Document;
}
