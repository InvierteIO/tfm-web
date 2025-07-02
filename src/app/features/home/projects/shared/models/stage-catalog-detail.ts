import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
import {InfrastructureInstallationMock} from './infrastructure-installation.mock';

export interface StageCatalogDetail {
  situation?: string;
  catalogDetail?: CatalogDetailMock;
  infraInstallation?: InfrastructureInstallationMock;
}
