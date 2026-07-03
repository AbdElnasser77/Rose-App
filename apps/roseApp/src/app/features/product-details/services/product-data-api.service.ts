import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL_CONFIG } from '@org/auth';
import { Product } from '../models/product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
   private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);


  getProductDetails(id: string): Observable<any> {
    return this._httpClient.get<Product>(
      `${this._baseUrlConfig.apiUrl}/products/${id}`
    );
  }

  getProduct(): Observable<any> {
    return this._httpClient.get<Product>(
      `${this._baseUrlConfig.apiUrl}/products`
    );
  }
}
