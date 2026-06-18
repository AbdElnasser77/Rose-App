import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  private readonly _platformId = inject(PLATFORM_ID);
  private get isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }

  setItem(key: string, value: unknown): void {
    if (!this.isBrowser) return;

    try {
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving to SessionStorage [${key}]:`, error);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const data = sessionStorage.getItem(key);
      if (!data) return null;

      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    } catch (error) {
      console.error(`Error reading from SessionStorage [${key}]:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from SessionStorage [${key}]:`, error);
    }
  }

  clearAll(): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing SessionStorage:', error);
    }
  }

  
  
}
