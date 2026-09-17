import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { SKIP_LOADER } from '@org/shared-util-loader';
import { Observable } from 'rxjs';
import { CategoryQueryParams } from '../models/category-query.model';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../models/category-request.model';
import {
  CategoryListResponse,
  CategoryMutationResponse,
  CategoryResponse,
} from '../models/category-response.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  private get _endpoint(): string {
    return `${this._baseUrlConfig.apiUrl}/categories`;
  }

  /**
   * `skipLoader` suppresses the app-wide spinner. Search and paging refetch
   * constantly, and flashing a full-screen overlay for each one is noise.
   */
  getCategories(
    queryParams: CategoryQueryParams,
    skipLoader = false
  ): Observable<CategoryListResponse> {
    let params = new HttpParams();

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this._httpClient.get<CategoryListResponse>(this._endpoint, {
      params,
      context: new HttpContext().set(SKIP_LOADER, skipLoader),
    });
  }

  getCategory(id: string): Observable<CategoryResponse> {
    return this._httpClient.get<CategoryResponse>(`${this._endpoint}/${id}`);
  }

  createCategory(
    body: CreateCategoryRequest
  ): Observable<CategoryMutationResponse> {
    return this._httpClient.post<CategoryMutationResponse>(
      this._endpoint,
      body
    );
  }

  updateCategory(
    id: string,
    body: UpdateCategoryRequest
  ): Observable<CategoryMutationResponse> {
    return this._httpClient.patch<CategoryMutationResponse>(
      `${this._endpoint}/${id}`,
      body
    );
  }

  deleteCategory(id: string): Observable<CategoryMutationResponse> {
    return this._httpClient.delete<CategoryMutationResponse>(
      `${this._endpoint}/${id}`
    );
  }
}
