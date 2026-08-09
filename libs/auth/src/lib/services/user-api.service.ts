import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BASE_URL_CONFIG } from '../config/auth-config.token';
import { UserModel } from '../models/responses/auth-response.model';
import { UserResponseModel } from '../models/responses/user-response.model';
import { UpdateProfileRequestModel } from '../models/requests/update-profile-request.model';
import {
  ConfirmEmailChangeRequestModel,
  RequestEmailChangeRequestModel,
} from '../models/requests/email-change-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig = inject(BASE_URL_CONFIG);

  private get baseUrl(): string {
    return `${this._baseUrlConfig.apiUrl}/users`;
  }

  getProfile(): Observable<UserModel> {
    return this._httpClient
      .get<UserResponseModel>(`${this.baseUrl}/profile`)
      .pipe(map((res) => res.payload.user));
  }

  updateProfile(data: UpdateProfileRequestModel): Observable<UserModel> {
    return this._httpClient
      .patch<UserResponseModel>(`${this.baseUrl}/profile`, data)
      .pipe(map((res) => res.payload.user));
  }

  deleteAccount(): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/account`);
  }

  // Sends a verification code to the new address. Neither email endpoint
  // documents a response body, so nothing here depends on one.
  requestEmailChange(data: RequestEmailChangeRequestModel): Observable<void> {
    return this._httpClient.post<void>(`${this.baseUrl}/email/request`, data);
  }

  confirmEmailChange(data: ConfirmEmailChangeRequestModel): Observable<void> {
    return this._httpClient.post<void>(`${this.baseUrl}/email/confirm`, data);
  }
}
