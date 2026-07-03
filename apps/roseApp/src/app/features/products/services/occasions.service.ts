import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_URL_CONFIG } from '@org/auth';
import { Occasion, OccasionsResponse } from '../models/occasion.model';

@Injectable({
  providedIn: 'root',
})
export class OccasionsService {
  private http = inject(HttpClient);
  private baseUrlConfig = inject(BASE_URL_CONFIG);

  getOccasions(page = 1, limit = 100): Observable<Occasion[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http
      .get<OccasionsResponse>(`${this.baseUrlConfig.apiUrl}/occasions`, { params })
      .pipe(map((res) => res.payload.data));
  }
}
