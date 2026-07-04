import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL_CONFIG } from '@org/auth';
import { Review } from '../../../../core/models/product.model';
@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
   private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);


  getReviews(productId: string): Observable<any> {
    return this._httpClient.get<Review>(
      `${this._baseUrlConfig.apiUrl}/reviews`,
      { params: { productId } }
    );
  }

  postReviews(data: Review): Observable<Review> {
    return this._httpClient.post<Review>(
      `${this._baseUrlConfig.apiUrl}/reviews`,
      data
    );
  }
}
