import { DiscountType } from "./product.model";

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  stock?: number;
  price?: number;
  discountType?:DiscountType;
  discountValue?: number;
  categoryId?: string;
}
