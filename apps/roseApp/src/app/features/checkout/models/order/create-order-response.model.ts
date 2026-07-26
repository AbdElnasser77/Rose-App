import { Product } from "../../../../shared/models/product.model"

export interface CreateOrderResponseModel {
    status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  order: Order
}

export interface Order {
  id: string
  userId: string
  addressId: string
  couponId: string
  status: string
  paymentMethod: string
  paymentStatus: string
  stripePaymentIntentId: any
  subtotal: string
  discount: string
  shipping: string
  total: string
  trackingNumber: any
  notes: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: string
  createdAt: string
  product: Product

}
