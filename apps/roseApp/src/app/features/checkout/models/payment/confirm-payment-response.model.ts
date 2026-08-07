export interface ConfirmPaymentResponseModel {
 status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  paymentIntent: PaymentIntent
  order: Order
}

export interface PaymentIntent {
  id: string
  status: string
  clientSecret: string
}

export interface Order {
  id: string
  paymentStatus: string
}
