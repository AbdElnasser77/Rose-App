import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OccasionsQueryParams } from '../models/occasions-query.model';
import { OccasionsResponseModel } from '../models/occasions-response.model';
import { BASE_URL_CONFIG } from '@org/auth';
import { SKIP_LOADER } from '@org/shared-util-loader';
import { OccasionsModel } from '../models/occasions.model';


@Injectable({ providedIn: 'root' })
export class OccasionsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  getOccasions(
    queryParams: OccasionsQueryParams,
    skipLoader = false
  ): Observable<OccasionsResponseModel> {
    let params = new HttpParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this._httpClient.get<OccasionsResponseModel>(
      `${this._baseUrlConfig.apiUrl}/occasions`,
      {
        params,
        context: new HttpContext().set(SKIP_LOADER, skipLoader),
      }
    );
  }

  deleteOccasions(id: string): Observable<void> {
    return this._httpClient.delete<void>(
      `${this._baseUrlConfig.apiUrl}/occasions/${id}`
    );
  } 

  getOccasionsById(id: string): Observable<any> {
    return this._httpClient.get<any>(
      `${this._baseUrlConfig.apiUrl}/occasions/${id}`
    );
  }

  createOccasions(occasionsData: OccasionsModel): Observable<OccasionsResponseModel> {
    return this._httpClient.post<OccasionsResponseModel>(
      `${this._baseUrlConfig.apiUrl}/occasions`,
      occasionsData
    );
  }

  updateOccasions(id: string, occasionsData: OccasionsModel): Observable<OccasionsResponseModel> {
    return this._httpClient.patch<OccasionsResponseModel>(
      `${this._baseUrlConfig.apiUrl}/occasions/${id}`,
      occasionsData
    );
  }
}