import { inject, Injectable } from '@angular/core';
import { CookieStorageService } from '@org/util-storage';
import { UserModel } from '../models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
   private readonly _storage = inject(CookieStorageService);

  setToken(token: string): void {
    this._storage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return this._storage.getItem<string>(TOKEN_KEY);
  }

  setUser(user: UserModel): void {
    this._storage.setItem(USER_KEY, user);
  }

  getUser(): UserModel | null {
    return this._storage.getItem<UserModel>(USER_KEY);
  }

  clear(): void {
    this._storage.removeItem(TOKEN_KEY);
    this._storage.removeItem(USER_KEY);
  }

  
  
  
}
