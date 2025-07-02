import {InstallationType} from './installation-data.type';
import {CatalogMock} from '../../../shared/models/catalog.mock.model';
import {InstallationDataType} from './installation-type.model';

export interface InfrastructureInstallationMock {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  dataType?: InstallationDataType;
  installationType?: InstallationType;
  other?: string;
  catalog?: CatalogMock;
}
