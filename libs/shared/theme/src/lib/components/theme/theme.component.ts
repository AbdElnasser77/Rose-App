import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

@Component({
  selector: 'lib-theme-toggle',
  imports: [LucideAngularModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeToggleComponent {
  readonly moon = Moon;
  readonly sun = Sun;
  private themeService = inject(ThemeService);

  isDark = this.themeService.isDark;

  toggle(): void {
    this.themeService.toggleTheme();
  }
}
