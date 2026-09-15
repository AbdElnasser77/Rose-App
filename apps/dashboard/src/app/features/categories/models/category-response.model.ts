import type { CategoryModel } from './category.model';

export interface CategoryListResponse {
  status: boolean;
  code: number;
  payload: CategoryListPayload;
}

export interface CategoryListPayload {
  data: CategoryModel[];
  metadata: CategoryMetadata;
}

export interface CategoryMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Shape returned by create, update and delete - `payload` is just the id. */
export interface CategoryMutationResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}

export interface CategoryResponse {
  status: boolean;
  code: number;
  payload: CategoryModel;
}
