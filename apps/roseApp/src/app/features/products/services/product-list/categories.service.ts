import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL_CONFIG } from '@org/auth';
import { CategoriesResponse, Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  getCategories(page = 1, limit = 100): Observable<Category[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http
      .get<CategoriesResponse>(`${this.baseUrlConfig.apiUrl}/categories`, { params })
      .pipe(map((res) => res.payload.data));
  }
}
