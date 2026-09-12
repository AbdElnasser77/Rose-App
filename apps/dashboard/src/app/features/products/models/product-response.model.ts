import type { ProductModel  } from './product.model';

export interface ProductResponseModel {
  status: boolean;
  code: number;
  payload: ProductPayload;
}

export interface ProductPayload {
  data: ProductModel[];
  metadata: ProductMetadata;
}

export interface ProductMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
