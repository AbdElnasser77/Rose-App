export interface CheckoutStateModel {
  addressId: string | null;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | null;
  couponCode: string | null;
  notes: string;
}