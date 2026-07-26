import { PaymentMethodType } from '../types/payment-method-type';

export interface CheckoutStateModel {
  addressId: string | null;
  paymentMethod: PaymentMethodType | null;
  couponCode: string | null;
  notes: string;
}
