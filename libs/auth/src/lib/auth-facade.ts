import { inject, Injectable } from '@angular/core';
import { AuthApiService, TokenService, UserApiService } from './services';
import { AuthStore } from './store/auth.store';
import {
  AuthPayloadModel,
  ConfirmEmailVerificationRequestModel,
  EmailRequestModel,
  LoginRequestModel,
  MessagePayloadModel,
  RegisterRequestModel,
  ResetPasswordRequestModel,
  UpdateProfileRequestModel,
  UserModel,
  RequestEmailChangeRequestModel,
  ConfirmEmailChangeRequestModel,
  ChangePasswordRequestModel,
} from './models';
import { finalize, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly _authApiService = inject(AuthApiService);
  private readonly _userApiService = inject(UserApiService);
  private readonly _authStore = inject(AuthStore);
  private readonly _tokenService = inject(TokenService);

  private startLoading() {
    this._authStore.setLoading(true);
  }

  private stopLoading() {
    this._authStore.setLoading(false);
  }

  // 1-login
  login(
    data: LoginRequestModel,
    rememberMe?: boolean,
  ): Observable<AuthPayloadModel> {
    this.startLoading();

    return this._authApiService.login(data).pipe(
      tap((payload) => {
        this._tokenService.setToken(payload.token, rememberMe);
        this._authStore.setUser(payload.user);
      }),
      finalize(() => this.stopLoading()),
    );
  }

  // 2-register
  register(data: RegisterRequestModel): Observable<AuthPayloadModel> {
    this.startLoading();

    return this._authApiService.register(data).pipe(
      tap((payload) => {
        this._tokenService.setToken(payload.token);
        this._authStore.setUser(payload.user);
      }),
      finalize(() => this.stopLoading()),
    );
  }

  // 3-logout
  logout(): void {
    this._tokenService.clearToken();
    this._authStore.clear();
  }

  // 4-sendEmailVerification
  sendEmailVerification(
    data: EmailRequestModel,
  ): Observable<MessagePayloadModel> {
    this.startLoading();

    return this._authApiService
      .sendEmailVerification(data)
      .pipe(finalize(() => this.stopLoading()));
  }
  //  5- confirmEmailVerification
  confirmEmailVerification(
    data: ConfirmEmailVerificationRequestModel,
  ): Observable<MessagePayloadModel> {
    this.startLoading();

    return this._authApiService
      .confirmEmailVerification(data)
      .pipe(finalize(() => this.stopLoading()));
  }
  //  6- forgotPassword
  forgotPassword(data: EmailRequestModel): Observable<MessagePayloadModel> {
    this.startLoading();

    return this._authApiService
      .forgotPassword(data)
      .pipe(finalize(() => this.stopLoading()));
  }
  // 7-Reset password
  resetPassword(
    data: ResetPasswordRequestModel,
  ): Observable<MessagePayloadModel> {
    this.startLoading();

    return this._authApiService
      .resetPassword(data)
      .pipe(finalize(() => this.stopLoading()));
  }
  //  8-Resend code
  resendEmailVerification(
    data: EmailRequestModel,
  ): Observable<MessagePayloadModel> {
    return this._authApiService.sendEmailVerification(data);
  }

  // 9-loadProfile
  loadProfile(): Observable<UserModel> {
    return this._userApiService
      .getProfile()
      .pipe(tap((user) => this._authStore.setUser(user)));
  }

  // 10-updateProfile
  updateProfile(data: UpdateProfileRequestModel): Observable<UserModel> {
    return this._userApiService
      .updateProfile(data)
      .pipe(tap((user) => this._authStore.setUser(user)));
  }

  // 11-deleteAccount
  // Tears the session down through logout() so there is a single place that
  // clears the token and the store.
  deleteAccount(): Observable<void> {
    return this._userApiService.deleteAccount().pipe(tap(() => this.logout()));
  }

  // 12-requestEmailChange
  requestEmailChange(data: RequestEmailChangeRequestModel): Observable<void> {
    return this._userApiService.requestEmailChange(data);
  }

  // 13-confirmEmailChange
  // Chains a profile reload: the confirm response carries no user, and the
  // cached email would otherwise stay stale everywhere it is displayed.
  confirmEmailChange(
    data: ConfirmEmailChangeRequestModel,
  ): Observable<UserModel> {
    return this._userApiService
      .confirmEmailChange(data)
      .pipe(switchMap(() => this.loadProfile()));
  }

  // 14-changePassword
  changePassword(data: ChangePasswordRequestModel): Observable<void> {
    return this._userApiService.changePassword(data);
  }
}
