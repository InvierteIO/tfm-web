import {BankMock} from './bank.mock.model';

export interface StageBankMock {
  accountNumber: string;
  interbankAccountNumber: string;
  currency: string;
  bank?: BankMock;
}
