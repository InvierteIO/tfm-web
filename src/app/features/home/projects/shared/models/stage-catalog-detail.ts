import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
import {InfraestructureInstallationMock} from './infraestructure-installation.mock';

export interface StageCatalogDetail {
  situation?: string;
  catalogDetail?: CatalogDetailMock;
  infraInstallation?: InfraestructureInstallationMock;
}
