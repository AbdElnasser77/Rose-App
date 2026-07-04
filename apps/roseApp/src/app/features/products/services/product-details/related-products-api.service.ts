import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { Observable } from 'rxjs';

export interface RelatedProductsParams {
  categoryId?: string;
  subCategoryId?: string;
  occasionId?: string;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RelatedProductsApiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  getRelatedProducts(params: RelatedProductsParams): Observable<any> {
    const queryParams: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams[key] = String(value);
      }
    });

    return this._httpClient.get<any>(`${this._baseUrlConfig.apiUrl}/products`, {
      params: queryParams,
    });
  }
}