import {ProjectStageStatus} from './project-stage-status.model';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';
import {StageBankMock} from './stage-bank.mock.model';
import {StageBonusTypeMock} from './stage-bonus-type.mock.model';
import {StageInfrastructureInstallationMock} from './stage-infrastructure-installation.mock.model';
import {StageCatalogDetail} from './stage-catalog-detail';

export interface ProjectStageMock {
  id: number;
  name?: string;
  stage?: string;
  kmlKmzUrl?: string;
  zipCode?: string;
  address?: string;
  addressReference?: string;
  addressNumber?: string;
  status?: ProjectStageStatus;
  endDate?: Date;
  handOverDate?: Date;
  commercializationCycle?: CommercializationCycle;
  stageBanks?: StageBankMock[];
  stageBonusTypes?: StageBonusTypeMock[];
  stageInfraInstallations?: StageInfrastructureInstallationMock[];
  stageCatalogDetails?: StageCatalogDetail[];
}
