import {CommercializationCycle} from './commercialization-cycle.mock.model';

export interface PropertyMock {
  id?: number;
  codeSystem?: string;
  codeEnterprise?: string;
  name?: string;
  isAvailableSale?: boolean;
  price?: number;
  commercializationCycle?: CommercializationCycle;
  isParkingSpace?: boolean;
  address?: string;
}
