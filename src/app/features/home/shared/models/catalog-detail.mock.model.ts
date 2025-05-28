import {CatalogMock} from './catalog.mock.model';

export interface CatalogDetailMock {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  other?: string;
  catalog?: CatalogMock;
}
