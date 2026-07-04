import { Product } from '../../../shared/models/product.model';

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsListPayload {
  data: Product[];
  metadata: PaginationMetadata;
}

export interface ProductsListResponse {
  status: boolean;
  code: number;
  payload: ProductsListPayload;
}
