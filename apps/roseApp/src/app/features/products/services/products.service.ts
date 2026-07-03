import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL_CONFIG } from '@org/auth';
import { ProductsListPayload, ProductsListResponse } from '../models/products-list.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  getProducts(page = 1, limit = 20): Observable<ProductsListPayload> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http
      .get<ProductsListResponse>(`${this.baseUrlConfig.apiUrl}/products`, { params })
      .pipe(map((res) => res.payload));
  }
}
