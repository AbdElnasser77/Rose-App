import { Component, DestroyRef, inject } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoaderContainerComponent } from '@org/ui';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { LoaderService } from '@org/shared-util-loader';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,NavbarComponent,FooterComponent,LoaderContainerComponent,AssetUrlPipe],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  private readonly loader = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);

  isLoggedIn = false;

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
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
