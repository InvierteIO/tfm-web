import {FinancialBankType} from './financial-bank-type.model';

export interface BankMock {
  id?: number;
  name?: string;
  bankType?: FinancialBankType;
}
