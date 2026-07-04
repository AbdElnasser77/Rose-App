import { Injectable, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoaderService } from '@org/shared-util-loader';

@Injectable({ providedIn: 'root' })
export class NavigationLoaderService {
  private readonly router = inject(Router);
  private readonly loader = inject(LoaderService);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loader.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loader.hide();
      }
    });
  }
}
