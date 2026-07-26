import { CartItem } from "./cart.model"

export interface CartResponseModel {
status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  cartItems: CartItem[]
}
