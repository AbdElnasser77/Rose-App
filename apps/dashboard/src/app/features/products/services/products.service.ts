import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { Observable } from 'rxjs';
import { ProductQueryParams } from '../models/product-query.model';
import { ProductResponseModel } from '../models/product-response.model';


@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  getProducts(queryParams: ProductQueryParams): Observable<ProductResponseModel> {
    let params = new HttpParams();

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this._httpClient.get<ProductResponseModel>(`${this._baseUrlConfig.apiUrl}/products`, { params });
  }


  deleteProduct(id: string): Observable<void> {
    return this._httpClient.delete<void>(
      `${this._baseUrlConfig.apiUrl}/products/${id}`
    );
  }

  
}