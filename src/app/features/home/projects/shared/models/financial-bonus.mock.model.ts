import {FinancialBonusTypeMockModel} from './financial-bonus-type.mock.model';

export interface FinancialBonusMockModel {
  id?: number;
  name?: string;
  types : FinancialBonusTypeMockModel[];
}
