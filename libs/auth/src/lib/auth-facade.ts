import { inject, Injectable } from '@angular/core';
import { AuthApiService, TokenService } from './services';
import { AuthStore } from './store/auth.store';
import { AuthPayloadModel, LoginRequestModel, RegisterRequestModel } from './models';
import { finalize, Observable, tap } from 'rxjs';
import { registerDispatcher } from 'node_modules/@angular/core/types/_event_dispatcher-chunk';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly _authApiService = inject(AuthApiService);
  private readonly _authStore = inject(AuthStore);
  private readonly _tokenService=inject(TokenService);

  // 1-login
  login(data:LoginRequestModel):Observable<AuthPayloadModel>{
    this._authStore.setLoading(true);
    this._authStore.setError(null);

    return this._authApiService.login(data).pipe(
      tap({
        next:(payload)=>{
          this._tokenService.setToken(payload.token);
          this._authStore.setUser(payload.user);
        },
        error:(translatedError: string)=>{
          this._authStore.setError(translatedError);
        }
      }),
      finalize(() => this._authStore.setLoading(false))
    )

  }
  

  // 2-register
  register(data:RegisterRequestModel):Observable<AuthPayloadModel>{
    this._authStore.setLoading(true);
    this._authStore.setError(null);

     return this._authApiService.login(data).pipe(
      tap({
        next:(payload)=>{
           this._tokenService.setToken(payload.token);
          this._authStore.setUser(payload.user);
        },
        error:(translatedError: string)=>{
          this._authStore.setError(translatedError);
        }
      }),
      finalize(() => this._authStore.setLoading(false))

     )
      
  }

  // 3-logout
  logout():void{
    this._tokenService.clearToken();
    this._authStore.clear();

  }
}
