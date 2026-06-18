import { inject, Injectable } from '@angular/core';
import { CookieStorageService } from '@org/util-storage';
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
   private readonly _storage = inject(CookieStorageService);

  setToken(token: string , rememberMe?: boolean): void {
    const expiresDays = rememberMe ? 90 : undefined;
    this._storage.setItem(TOKEN_KEY, token,expiresDays);
  }

  getToken(): string | null {
    return this._storage.getItem<string>(TOKEN_KEY);
  }

  clearToken(): void {
    this._storage.removeItem(TOKEN_KEY);
  }

  
  
}
