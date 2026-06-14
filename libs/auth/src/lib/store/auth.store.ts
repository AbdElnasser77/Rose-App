import { computed, Injectable, signal } from '@angular/core';
import { UserModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  readonly user = signal<UserModel | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
   readonly isAuthenticated = computed(
   ()=> !!this.user()
   )

    setUser(user: UserModel): void {
    this.user.set(user);
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  setError(message: string | null): void {
    this.error.set(message);
  }

  clearError(): void {
    this.error.set(null);
  }

  clearUser(): void {
    this.user.set(null);
  }

  // Reset all state (logout / reset session)
  clear(): void {
    this.user.set(null);
    this.loading.set(false);
    this.error.set(null);
  }

  
}
