import { Component, inject ,computed } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, Moon, Sun ,Palette } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, SessionService } from '@org/auth';

@Component({
  selector: 'lib-theme-toggle',
  imports: [LucideAngularModule ,TranslatePipe],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeToggleComponent {
 
  private themeService = inject(ThemeService);
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);

  readonly moon = Moon;
  readonly sun = Sun;
  readonly Palette = Palette;

  isDark = this.themeService.isDark;
   readonly isLoggedIn = computed(
      () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
    );

  toggle(): void {
    this.themeService.toggleTheme();
  }
}
