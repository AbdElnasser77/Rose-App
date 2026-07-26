import { PaymentMethodType } from "../types/payment-method-type";

export interface PaymentMethodModel {
    id:string;
    type: PaymentMethodType;
    name:string;
    description:string;
    image:string;
    // Offered in the UI but not implemented yet - selecting it must not reach the store.
    disabled?: boolean;

}
