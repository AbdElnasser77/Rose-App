import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SsrCookieService} from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class CookieStorageService {
  private readonly _platformId=inject(PLATFORM_ID);
  private readonly _cookieService = inject(SsrCookieService);

  private get isBrowser():boolean{
    return isPlatformBrowser(this._platformId);
  }

  setItem(key:string,value:unknown , expiresDays?: number ):void{
    if(!this.isBrowser) return ;

    try{
      const stringValue=typeof(value)==='string'?value:JSON.stringify(value);
      const cookieOptions: any = {
      path: '/',
      secure: true,
      sameSite: 'Lax'
     };
      
      if (expiresDays !== undefined && expiresDays !== null) {
        const expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + expiresDays);
        cookieOptions.expires = expiresDate;
      }

      this._cookieService.set(key, stringValue, cookieOptions);

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
