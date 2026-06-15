import { inject, Injectable } from '@angular/core';
import { AuthApiService, AuthStorageService} from './services';
import { AuthStore } from './store/auth.store';
import { AuthPayloadModel, ConfirmEmailVerificationRequestModel, EmailRequestModel, LoginRequestModel, MessagePayloadModel, RegisterRequestModel, ResetPasswordRequestModel } from './models';
import {  finalize, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly _authApiService = inject(AuthApiService);
  private readonly _authStore = inject(AuthStore);
  private readonly _authStorageService=inject(AuthStorageService);


  private startLoading() {
  this._authStore.setLoading(true);
}

private stopLoading() {
  this._authStore.setLoading(false);
}

  // 1-login
  login(data:LoginRequestModel):Observable<AuthPayloadModel>{
      this.startLoading();


    return this._authApiService.login(data).pipe(
      tap((payload)=>{
          this._authStorageService.setToken(payload.token);
          this._authStorageService.setUser(payload.user);
          this._authStore.setUser(payload.user);
        
      }),
      finalize(() => this.stopLoading())
    )

  }
  

  // 2-register
  register(data:RegisterRequestModel):Observable<AuthPayloadModel>{
      this.startLoading();


     return this._authApiService.register(data).pipe(
      tap((payload)=>{
           this._authStorageService.setToken(payload.token);
           this._authStorageService.setUser(payload.user);
          this._authStore.setUser(payload.user);
        
      }),
      finalize(() => this.stopLoading())

     )
      
  }

  // 3-logout
  logout():void{
    this._authStorageService.clear();
    this._authStore.clear();

  }

  // 4-sendEmailVerification
  sendEmailVerification(data: EmailRequestModel): Observable<MessagePayloadModel> {
    this.startLoading();


  return this._authApiService.sendEmailVerification(data).pipe(
    
    finalize(() => this.stopLoading())
  );
}
  //  5- confirmEmailVerification
  confirmEmailVerification(data: ConfirmEmailVerificationRequestModel): Observable<MessagePayloadModel> {
    this.startLoading();


  return this._authApiService.confirmEmailVerification(data).pipe(
    
    finalize(() => this.stopLoading())
  );
}
  //  6- forgotPassword
  forgotPassword(data: EmailRequestModel): Observable<MessagePayloadModel> {
    this.startLoading();


  return this._authApiService.forgotPassword(data).pipe(
    
    finalize(() => this.stopLoading())
  );
}
  // 7-Reset password
  resetPassword(data: ResetPasswordRequestModel): Observable<MessagePayloadModel> {
    this.startLoading();


  return this._authApiService.resetPassword(data).pipe(
    
    finalize(() => this.stopLoading())
  );
}
}
