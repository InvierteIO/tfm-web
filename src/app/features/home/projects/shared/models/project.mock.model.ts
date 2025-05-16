import {ProjectStatus} from './project-status.model';

export interface ProjectMock {
  id: number;
  name?: string;
  address?: string;
  numberApartments?: number;
  numberLands?: number;
  numberHouses?: number;
  stages?: number;
  areaTotal?: number;
  status?: ProjectStatus;
}
