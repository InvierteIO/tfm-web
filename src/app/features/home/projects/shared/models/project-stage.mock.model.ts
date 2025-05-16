import {ProjectStageStatus} from './project-stage-status.model';

export interface ProjectStageMock {
  id: number;
  name?: string;
  address?: string;
  numberApartments?: number;
  numberLands?: number;
  numberHouses?: number;
  typesProperty: number;
  stage?: string;
  areaTotal?: number;
  status?: ProjectStageStatus;
}
