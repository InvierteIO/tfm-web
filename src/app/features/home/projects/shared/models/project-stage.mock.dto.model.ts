import {ProjectStageStatus} from './project-stage-status.model';

export interface ProjectStageDtoMock {
  id?: number;
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
  commercializationCycle?: string;

  /*********Datos sumarizados************/
  numberApartments?: number;
  numberLands?: number;
  numberHouses?: number;

  typesProperty?: number;
  areaTotal?: number;
}
