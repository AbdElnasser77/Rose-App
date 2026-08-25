export interface CreateCheckoutSessionResponseModel {
   status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  checkoutUrl: string
  sessionId: string
  expiresAt: string
  reused: boolean
}
