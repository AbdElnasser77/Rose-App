import { PaymentMethodType } from '../../types/payment-method-type';

export interface CreateOrderRequestModel {
  addressId: string;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  notes?: string;
}
