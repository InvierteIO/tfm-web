import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';

export interface PropertyDocumentMock {
  id?: number;
  filename?: string;
  path?: string;
  createdAt?: Date;
  catalogDetail?: CatalogDetailMock;
}
