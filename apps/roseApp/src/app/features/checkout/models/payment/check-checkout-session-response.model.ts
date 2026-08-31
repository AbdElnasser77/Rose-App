export interface CheckCheckoutSessionResponseModel {
  status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  sessionId: string
  paymentStatus: string
  sessionStatus: string
  amountTotal: number
  currency: string
  order: Order
}

export interface Order {
  orderId: string
  paymentStatus: string
}