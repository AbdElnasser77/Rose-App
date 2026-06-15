import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { JwtPayloadModel } from '../models/jwt-payload.model';
import { UserModel } from '../models';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly _authStorageService = inject(AuthStorageService);
  private readonly _authStore = inject(AuthStore);

    initSession(): void {
      const token=this._authStorageService.getToken();
      const savedUser = this.getSavedUserFromStorage();

      if (token && !this.isTokenExpired(token) && savedUser) {
      const payload = this.decodeToken(token);
      if (payload) {
        this._authStore.setUser(savedUser); 
        return; 
      }
      }

    this.clearSession();

      
    }

    isAuthenticated():boolean{
          const token=this._authStorageService.getToken();
          return !!token && !this.isTokenExpired(token);
    }

    clearSession(): void {
    this._authStorageService.clear();
    this._authStore.clear();
  }


   private getSavedUserFromStorage(): UserModel | null {
    return this._authStorageService.getUser();
  }
    private decodeToken(token:string):JwtPayloadModel | null{
      try{
        const payloadBase64=token.split('.')[1];
        if(!payloadBase64){
          return null ;
        }

        return JSON.parse(atob(payloadBase64)) as JwtPayloadModel;
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
