import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '@org/auth';
import { OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);

  getOrders(page = 1, limit = 20): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this._baseUrlConfig.apiUrl}/orders`
      ,
    {
      params: {
        page,
        limit
      }
    }
    );
  }
}