import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { ThemeService } from '@rose/theme';
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslatePipe, LanguageSwitcherComponent, ThemeToggleComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;
}
