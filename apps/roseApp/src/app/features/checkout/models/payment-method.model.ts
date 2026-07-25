import { PaymentMethodType } from "../types/payment-method-type";

export interface PaymentMethodModel {
    id:string;
    type: PaymentMethodType;
    name:string;
    description:string;
    image:string;

}
