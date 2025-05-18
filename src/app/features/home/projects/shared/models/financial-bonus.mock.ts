import {FinancialBonusTypeMock} from './financial-bonus-type.mock';

export interface FinancialBonusMock {
  id?: number;
  name?: string;
  types : FinancialBonusTypeMock[];
}
