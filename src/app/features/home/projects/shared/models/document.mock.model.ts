import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
export interface DocumentMock {
  id?: number;
  filename?: string;
  path?: string;
  creationDate?: Date;
  name?: string;
  description?: string;
  catalogDetail?: CatalogDetailMock;
}
