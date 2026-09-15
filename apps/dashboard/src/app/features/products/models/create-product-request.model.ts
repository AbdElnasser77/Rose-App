export type DiscountType = 'PERCENT' | 'FIXED';

export interface CreateProductRequest {
  title: string;
  description: string;
  stock: number;
  price: number;
  discountType: DiscountType;
  discountValue: number;
  categoryId: string;
  cover: string;
  gallery: string[];
}