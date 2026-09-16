import type { OccasionsModel  } from './occasions.model';

export interface OccasionsResponseModel {
  status: boolean;
  code: number;
  payload: OccasionsPayload;
}

export interface OccasionsPayload {
  data: OccasionsModel[];
  metadata: OccasionsMetadata;
}

export interface OccasionsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
