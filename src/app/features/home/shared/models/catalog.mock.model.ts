import {CatalogDetailMock} from './catalog-detail.mock.model';

export interface CatalogMock {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  other?: string;
  catalogDetails?: CatalogDetailMock[];
}
