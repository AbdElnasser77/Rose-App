export interface ProductModel {
  status: boolean
  code: number
  payload: Payload
}

export interface Payload {
  product: Product
}

export interface Product {
  id: string
  title: string
  description: string
  rating: number
  ratings: number
  stock: number
  price: string
  discountType: string
  discountValue: string
  cover: string
  gallery: string
  categoryId: string
  subCategoryId: any
  immutable: boolean
  createdAt: string
  updatedAt: string
  category: Category
  subCategory: any
  occasions: any[]
  reviews: Review[]
  _count: Count
}

export interface Category {
  id: string
  title: string
  description: string
  image: string
  immutable: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id?: string
  userId?: string
  productId?: string
  headline: string
  content: string
  rating: number
  createdAt?: string
  updatedAt?: string
  user?: User
}

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface Count {
  reviews: number
  cartItems: number
  wishlistItems: number
}
