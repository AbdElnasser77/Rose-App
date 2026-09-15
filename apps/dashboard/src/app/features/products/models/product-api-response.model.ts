import { ProductModel } from './product.model';

export interface ProductApiResponse {
  status: boolean;
  code: number;
  payload: {
    product: ProductModel;
  };
}
