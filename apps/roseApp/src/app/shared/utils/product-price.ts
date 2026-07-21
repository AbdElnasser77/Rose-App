
import { DiscountableProductModel } from '../models/discountable-product.model';
import { Product } from '../models/product.model';


export function getCurrentPrice( product: DiscountableProductModel): number {
  const price = Number(product.price);

  if (product.discountType !== 'PERCENT') {
    return price;
  }

  return price - (price * Number(product.discountValue)) / 100;
}

export function hasDiscount(product: DiscountableProductModel): boolean {
  return Number(product.discountValue) > 0;
}