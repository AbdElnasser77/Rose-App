import { Injectable, computed, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly count = signal(0);
  public readonly loading = computed(() => this.count() > 0);

  show(): void {
    this.count.update((n) => n + 1);
  }

  hide(): void {
    this.count.update((n) => Math.max(0, n - 1));
  }

  reset(): void {
    this.count.set(0);
  }

  track<T>() {
    return (source$: Observable<T>): Observable<T> => {
      this.show();
      return source$.pipe(finalize(() => this.hide()));
    };
  }
}
