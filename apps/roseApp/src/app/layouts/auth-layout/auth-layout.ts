import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { ThemeService } from '@rose/theme';
import { ToastContainerComponent, LoaderContainerComponent } from '@org/ui';
import { AssetUrlPipe } from '../../core/pipes/asset-url.pipe';
import { NavigationLoaderService } from '../../core/services/navigation-loader.service';
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LanguageSwitcherComponent, ThemeToggleComponent, ToastContainerComponent, LoaderContainerComponent, AssetUrlPipe],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private themeService = inject(ThemeService);
  private readonly _navigationLoader = inject(NavigationLoaderService);

  isDark = this.themeService.isDark;
}
