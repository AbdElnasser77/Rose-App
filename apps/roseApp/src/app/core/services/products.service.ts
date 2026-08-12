import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { SKIP_LOADER } from '@org/shared-util-loader';
import { Observable } from 'rxjs';
import { ProductQueryParams, ProductsListResponse } from '../../shared/models/products-list-response.model';

export interface ProductsRequestOptions {
  skipLoader?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrlConfig = inject(BASE_URL_CONFIG);

  getProducts(
    query: ProductQueryParams = {},
    options: ProductsRequestOptions = {}
  ): Observable<ProductsListResponse> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<ProductsListResponse>(
      `${this.baseUrlConfig.apiUrl}/products`,
      {
        params,
        context: new HttpContext().set(SKIP_LOADER, options.skipLoader ?? false),
      }
    );
  }
}