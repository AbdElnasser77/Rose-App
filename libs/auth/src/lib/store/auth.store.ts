import { computed, Injectable, signal } from '@angular/core';
import { UserModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  readonly user = signal<UserModel | null>(null);
  readonly loading = signal<boolean>(false);
   readonly isAuthenticated = computed(
   ()=> !!this.user()
   )

    setUser(user: UserModel): void {
    this.user.set(user);
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }


  clearUser(): void {
    this.user.set(null);
  }

  // Reset all state (logout / reset session)
  clear(): void {
    this.user.set(null);
    this.loading.set(false);
  }

  
}
