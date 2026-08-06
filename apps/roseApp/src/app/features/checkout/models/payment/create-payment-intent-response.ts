export interface CreatePaymentIntentResponse {
  status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  clientSecret: string
  paymentIntentId: string
}

