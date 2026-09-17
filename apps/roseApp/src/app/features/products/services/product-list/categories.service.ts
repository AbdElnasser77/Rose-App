import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BASE_URL_CONFIG } from '@org/auth';
import { CategoriesResponse, Category } from '../../models/category.model';

/** The API rejects anything higher with "Limit cannot exceed 100". */
const MAX_PAGE_SIZE = 100;

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  private fetchPage(page: number, limit: number): Observable<CategoriesResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<CategoriesResponse>(
      `${this.baseUrlConfig.apiUrl}/categories`,
      { params }
    );
  }

  getCategories(page = 1, limit = MAX_PAGE_SIZE): Observable<Category[]> {
    return this.fetchPage(page, limit).pipe(map((res) => res.payload.data));
  }

  /**
   * Every category, across as many pages as it takes. A single request caps out
   * at 100, so once the store passes that the tail was silently dropped.
   */
  getAllCategories(): Observable<Category[]> {
    return this.fetchPage(1, MAX_PAGE_SIZE).pipe(
      switchMap((first) => {
        const { totalPages } = first.payload.metadata;

        if (totalPages <= 1) {
          return of(first.payload.data);
        }

        const remainingPages = Array.from(
          { length: totalPages - 1 },
          (_, index) => this.fetchPage(index + 2, MAX_PAGE_SIZE)
        );

        // forkJoin keeps page order, so the combined list stays as the API sorted it.
        return forkJoin(remainingPages).pipe(
          map((responses) => [
            ...first.payload.data,
            ...responses.flatMap((response) => response.payload.data),
          ])
        );
      })
    );
  }
}
