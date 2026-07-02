import { PaginationMetadata } from './products-list.model';

export interface Occasion {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OccasionsResponse {
  status: boolean;
  code: number;
  payload: {
    data: Occasion[];
    metadata: PaginationMetadata;
  };
}
