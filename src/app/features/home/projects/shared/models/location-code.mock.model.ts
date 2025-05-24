export type LocationType = 'REGION' | 'PROVINCE' | 'DISTRICT' | 'UNKNOWN';

export interface LocationCode {
  id: number;
  code: string;
  type: LocationType;
  name: string;
}

