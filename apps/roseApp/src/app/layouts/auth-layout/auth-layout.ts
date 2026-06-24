import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { ThemeService } from '@rose/theme';
import { ToastContainerComponent } from '@org/ui';
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, LanguageSwitcherComponent, ThemeToggleComponent, ToastContainerComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;
}
