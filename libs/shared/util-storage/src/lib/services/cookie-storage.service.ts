import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieStorageService {
  private readonly _platformId=inject(PLATFORM_ID);
  private readonly _cookieService = inject(CookieService);

  private get isBrowser():boolean{
    return isPlatformBrowser(this._platformId);
  }

  setItem(key:string,value:unknown , expiresDays: number = 90):void{
    if(!this.isBrowser) return ;

    try{
      const stringValue=typeof(value)==='string'?value:JSON.stringify(value);
      this._cookieService.set(key, stringValue, {
        expires: expiresDays,
        path: '/',
        secure: true,
       sameSite: 'Lax'
      });
    } catch (error) {
      console.error(`Error saving to Cookies [${key}]:`, error);
    }
  }


  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const exists = this._cookieService.check(key);
      if (!exists) return null;

      const data = this._cookieService.get(key);
      if (!data) return null;

      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from Cookies [${key}]:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      this._cookieService.delete(key, '/');
    } catch (error) {
      console.error(`Error removing from Cookies [${key}]:`, error);
    }
  }


  clearAll(): void {
    if (!this.isBrowser) return;
    try {
      this._cookieService.deleteAll('/');
    } catch (error) {
      console.error('Error clearing all Cookies:', error);
    }
  }
  
  
}
