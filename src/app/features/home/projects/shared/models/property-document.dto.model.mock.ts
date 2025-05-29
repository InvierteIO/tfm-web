import {StagePropertyGroupMock} from './stage-property-group.mock.model';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';

export interface PropertyDocumentDtoMock {
  id?: number;
  codeSystem?: string;
  codeEnterprise?: string;
  name?: string;
  isAvailableSale?: boolean;
  price?: number;
  commercializationCycle?: CommercializationCycle;
  isParkingSpace?: boolean;
  address?: string;
  stagePropertyGroup?: StagePropertyGroupMock;
}



