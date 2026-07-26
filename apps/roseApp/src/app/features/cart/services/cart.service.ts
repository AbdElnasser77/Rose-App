import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartItem } from '../models/cart.model';
import { map, Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '@org/auth';
import { CartResponseModel } from '../models/cart-response.model';
import { CouponModel } from '../../../shared/models/coupon.model';

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

  // `search` is a substring filter on the code, so the exact match still has to be
  // verified by the caller - it narrows the page rather than returning one coupon.
  getCoupons(search?: string, page = 1, limit = 20): Observable<CouponModel[]> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.baseUrlConfig.apiUrl}/coupons`, { params })
    .pipe(map((res) => res.payload.data));
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