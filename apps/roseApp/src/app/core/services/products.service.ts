import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Product } from '../models/product.model';

interface ProductsListResponse {
  status: boolean;
  code: number;
  payload: {
    data: Product[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  occasionId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rose-app.elevate-bootcamp.cloud/api';

  getProducts(query: ProductQueryParams = {}): Observable<ProductsListResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ProductsListResponse>(`${this.baseUrl}/products`, {
      params,
    });
  }
}