import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { JwtPayloadModel } from '../models/jwt-payload.model';
import { TokenService } from './token.service';
import { isPlatformBrowser } from '@angular/common';
import { Buffer } from 'buffer';
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly _tokenService = inject(TokenService);
  private readonly _authStore = inject(AuthStore);
  private readonly _platformId = inject(PLATFORM_ID); 

    initSession(): void {
      const token=this._tokenService.getToken();

      if (!token || this.isTokenExpired(token)) {
      this.clearSession();
      return;
    }

    // Get user from api/users/profile
    
    }

    isAuthenticated():boolean{
          const token=this._tokenService.getToken();
          return !!token && !this.isTokenExpired(token);
    }

    clearSession(): void {
    this._tokenService.clearToken();
    this._authStore.clear();
  }


   
    private decodeToken(token:string):JwtPayloadModel | null{
         try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    let decoded: string;

    if (isPlatformBrowser(this._platformId)) {
      decoded = atob(payloadBase64);
    } else {
      decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    }

    return JSON.parse(decoded) as JwtPayloadModel;
      }
      catch {
      return null;
      }
    }



    private isTokenExpired(token:string):boolean{
          const payload = this.decodeToken(token);

          if(!payload?.exp){
            return true;
          }

          const expirationTime=payload.exp*1000;

          return Date.now() >=expirationTime ;

    }

  
}
