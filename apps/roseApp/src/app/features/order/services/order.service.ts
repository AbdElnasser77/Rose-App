import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Order } from '../models/order.model';
import { BASE_URL_CONFIG } from '@org/auth';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);

  getOrders(): Observable<Order[]> {
    return this.http.get<ApiResponse<Order[]>>(`${this._baseUrlConfig.apiUrl}/orders`).pipe(
      map(res => res.payload.data)
    );
  }
}