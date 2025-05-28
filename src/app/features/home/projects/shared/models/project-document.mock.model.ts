import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';

export interface ProjectDocumentMock {
  id?: number;
  name?: string;
  filename?: string;
  path?: string;
  createdAt?: Date;
  catalogDetail?: CatalogDetailMock;
}
