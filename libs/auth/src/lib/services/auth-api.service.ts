import {  inject, Injectable } from '@angular/core';
import { AuthAbstract } from '../abstract/auth.abstract';
import { map, Observable } from 'rxjs';
import { ConfirmEmailVerificationRequestModel } from '../models/requests/confirm-email-verification-request.model';
import { LoginRequestModel } from '../models/requests/login-request.model';
import { RegisterRequestModel } from '../models/requests/register-request.model';
import { ResetPasswordRequestModel } from '../models/requests/reset-password-request.model';
import { HttpClient } from '@angular/common/http';
import {  BASE_URL_CONFIG } from '../config/auth-config.token';
import { EmailRequestModel } from '../models/requests/email-request.model';
import { MessagePayloadModel, MessageResponseModel } from '../models/responses/message-response.model';
import { AuthPayloadModel, AuthResponseModel } from '../models/responses/auth-response.model';
import { MessageAdaptor } from '../adaptors/message.adaptor';
import { AuthAdaptor } from '../adaptors/auth.adaptor';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements AuthAbstract {
   private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);
  private readonly _messageAdaptor=inject(MessageAdaptor);
  private readonly _authAdaptor=inject(AuthAdaptor);


  sendEmailVerification(data: EmailRequestModel): Observable<MessagePayloadModel> {
    return this._httpClient.post<MessageResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/send-email-verification`,
      data
    ).pipe(
        map((res) => this._messageAdaptor.adapt(res))

    );
  }
  confirmEmailVerification(data: ConfirmEmailVerificationRequestModel): Observable<MessagePayloadModel> {
     return this._httpClient.post<MessageResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/confirm-email-verification`,
      data
    ).pipe(
        map((res) => this._messageAdaptor.adapt(res))

    );
  }
  register(data: RegisterRequestModel): Observable<AuthPayloadModel> {
     return this._httpClient.post<AuthResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/register`,
      data
    ).pipe(
        map((res) => this._authAdaptor.adapt(res))

    );
  }
  login(data: LoginRequestModel): Observable<AuthPayloadModel> {
    return this._httpClient.post<AuthResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/login`,
      data
    ).pipe(
        map((res) => this._authAdaptor.adapt(res))

    );
  }
  forgotPassword(data: EmailRequestModel): Observable<MessagePayloadModel> {
    return this._httpClient.post<MessageResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/forgot-password`,
      data
    ).pipe(
        map((res) => this._messageAdaptor.adapt(res))

    );
  }
  resetPassword(data: ResetPasswordRequestModel): Observable<MessagePayloadModel> {
    return this._httpClient.post<MessageResponseModel>(
      `${this._baseUrlConfig.apiUrl}/auth/reset-password`,
      data
    ).pipe(
        map((res) => this._messageAdaptor.adapt(res))

    );

  }
  
}
