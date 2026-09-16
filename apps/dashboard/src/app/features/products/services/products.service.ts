import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { Observable } from 'rxjs';
import { ProductQueryParams } from '../models/product-query.model';
import { ProductResponseModel } from '../models/product-response.model';
import { CreateProductRequest } from '../models/create-product-request.model';
import { UpdateProductRequest } from '../models/update-product-request.model';
import { ProductApiResponse } from '../models/product-api-response.model';
import { DiscountType } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  // Fetches products using the provided query parameters.
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

    // Fetches product using the provided id.
  getProduct(id: string): Observable<ProductApiResponse> {
  return this._httpClient.get<ProductApiResponse>(
    `${this._baseUrlConfig.apiUrl}/products/${id}`
  );
  }

  // Creates a new product.
  createProduct(productData: CreateProductRequest): Observable<ProductApiResponse> {
  return this._httpClient.post<ProductApiResponse>(
    `${this._baseUrlConfig.apiUrl}/products`,
    productData
  );
  }

  // update product
  updateProduct(id: string,productData: UpdateProductRequest): Observable<ProductApiResponse> {
  return this._httpClient.patch<ProductApiResponse>(
    `${this._baseUrlConfig.apiUrl}/products/${id}`,
    productData
  );
}

  // Deletes a product by its identifier.
  deleteProduct(id: string): Observable<void> {
    return this._httpClient.delete<void>(
      `${this._baseUrlConfig.apiUrl}/products/${id}`
    );
  }

  
 
   // Temporary: Categories and Occasions API calls will be moved
   // to their dedicated services once implemented.

  // Fetches all available occasions.
   getOccasions() {
  const params = new HttpParams()
    .set('page', 1)
    .set('limit', 100);

  return this._httpClient.get<any>(
    `${this._baseUrlConfig.apiUrl}/occasions`,
    { params }
  );
  } 

  // Fetches all available categories.
  getCategories() {
  const params = new HttpParams()
    .set('page', 1)
    .set('limit', 100);

  return this._httpClient.get<any>(
    `${this._baseUrlConfig.apiUrl}/categories`,
    { params }
  );
}
}