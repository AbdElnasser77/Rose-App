import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL_CONFIG } from '@org/auth';
import { map, Observable } from 'rxjs';
import {
  AdminStatistics,
  AdminStatisticsQuery,
  AdminStatisticsResponse,
} from '../models/admin-statistics.model';

/**
 * `GET /admin/statistics` returns every panel on the overview in one payload,
 * so the page makes a single request. Requires an ADMIN bearer token, which
 * `authInterceptor` attaches from the shell.
 */
@Injectable({ providedIn: 'root' })
export class OverviewService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  getStatistics(query: AdminStatisticsQuery = {}): Observable<AdminStatistics> {
    let params = new HttpParams();

    // Only send what the caller set; the API has its own defaults for the rest.
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    }

    return this._httpClient
      .get<AdminStatisticsResponse>(
        `${this._baseUrlConfig.apiUrl}/admin/statistics`,
        { params },
      )
      .pipe(map((response) => response.payload));
  }
}
