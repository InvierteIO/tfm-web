import {FinancialBonusTypeMock} from './financial-bonus-type.mock';

export interface StageBonusTypeMock {
  typeValue: string;
  financialBonusType?: FinancialBonusTypeMock;
}
