import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly _platformId=inject(PLATFORM_ID);


  private get isBrowser():boolean{
    return isPlatformBrowser(this._platformId);
  }

  setItem(key:string,value:unknown):void{
    if(!this.isBrowser) return ;

    try{
      const stringValue=typeof(value)==='string'?value:JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    }catch(error){
      console.error(`Error saving to LocalStorage [${key}]:`, error);
    }
  }


  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      try{
        return JSON.parse(data) as T;
     }catch{
      return data as unknown as T
     }
     }catch (error) {
      console.error(`Error reading from LocalStorage [${key}]:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from LocalStorage [${key}]:`, error);
    }
  }


  clearAll(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing LocalStorage:', error);
    }
  }
  
}
