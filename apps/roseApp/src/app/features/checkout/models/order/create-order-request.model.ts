export interface CreateOrderRequestModel {
  addressId: string;
  paymentMethod: 'CASH' | 'CREDIT_CARD';
  couponCode?: string;
  notes?: string;
}
