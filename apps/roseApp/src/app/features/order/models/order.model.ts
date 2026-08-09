export interface Product {
  id: string;
  title: string;
  cover: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  createdAt: string;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  couponId: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface ApiResponse<T> {
  status: boolean;
  code: number;
  payload: {
    data: T;
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}