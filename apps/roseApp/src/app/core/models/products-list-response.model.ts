import type { Product } from './product.model';

export interface ProductsListResponse {
  status: boolean;
  code: number;
  payload: {
    data: Product[];
    metadata: ProductsMetadata;
  };
}

export interface ProductsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  occasionId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}