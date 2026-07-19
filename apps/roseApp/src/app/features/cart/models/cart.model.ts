import { Product } from "../../../shared/models/product.model";

export interface CartResponse {
  status: boolean;
  code: number;
  payload: {
    cartItems: CartItem[];
  };
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}
