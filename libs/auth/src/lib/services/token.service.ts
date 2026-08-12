import { inject, Injectable, signal } from '@angular/core';
import { CookieStorageService } from '@org/util-storage';
const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
   private readonly _storage = inject(CookieStorageService);

  // The cookie is not reactive, so a computed that only reads it never gets
  // invalidated - the navbar kept greeting a signed-out user after logout.
  // Every write bumps this, and getToken() tracks it, so signal consumers
  // recompute while still reading the cookie fresh.
  private readonly _revision = signal(0);

  setToken(token: string , rememberMe?: boolean): void {
    const expiresDays = rememberMe ? 90 : undefined;
    this._storage.setItem(TOKEN_KEY, token,expiresDays);
    this._revision.update(revision => revision + 1);
  }

  getToken(): string | null {
    this._revision();
    return this._storage.getItem<string>(TOKEN_KEY);
  }

  clearToken(): void {
    this._storage.removeItem(TOKEN_KEY);
    this._revision.update(revision => revision + 1);
  }

  
  
}
