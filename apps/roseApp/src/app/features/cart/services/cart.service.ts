import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart.model';
import { map, Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '@org/auth';
import { CartResponseModel } from '../models/cart-response.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartResponseModel>(`${this.baseUrlConfig.apiUrl}/cart`)
    .pipe(map((res) => res.payload.cartItems));
  }

  addToCart(data: {}): Observable<any> {
    return this.http.post<CartResponseModel>(`${this.baseUrlConfig.apiUrl}/cart`, data);
  }

  getCoupons(couponsId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlConfig.apiUrl}/coupons/${couponsId}`)
    .pipe(map((res) => res.payload.coupon));
  }

  updateCartQuantity(cartItemId: string, quantity: {}): Observable<CartItem[]> {
    return this.http.patch<CartResponseModel>(`${this.baseUrlConfig.apiUrl}/cart/${cartItemId}`, quantity)
    .pipe(map((res) => res.payload.cartItems));
  }

  clearCartItems(): Observable<any> {
    return this.http.delete(`${this.baseUrlConfig.apiUrl}/cart`);
  }

  deleteCartItem(cartItemId: string): Observable<any> {
    return this.http.delete(`${this.baseUrlConfig.apiUrl}/cart/${cartItemId}`);
  }
}