import {ProjectStatus} from './project-status.model';
import {ProjectStageMock} from './project-stage.mock.model';
import {ProjectDocumentMock} from './project-document.mock.model';

export interface ProjectMock {
  id: number;
  name?: string;
  address?: string;
  numberApartments?: number;
  numberLands?: number;
  numberHouses?: number;
  stages?: number;
  areaTotal?: number;
  status?: ProjectStatus;
  taxIdentificationNumber?: string;

  officeAddress?: string;
  officeNumber?: string;
  supervisor?: string;
  zipCode?: string;
  description?: string;
  kmlKmzUrl?: string;

  projectStages?: ProjectStageMock[];
  projectDocuments?: ProjectDocumentMock[];
}
