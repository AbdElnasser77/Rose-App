import {
  computed,
  DOCUMENT,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document: Document = inject(DOCUMENT);

  private darkClass = 'dark';
  theme = signal<Theme>('light');

  isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.loadTheme();
    effect(() => {
      this.applyTheme(this.theme());
      localStorage.setItem('theme', this.theme());
    });
  }

  toggleTheme(): void {
    this.theme.set(this.isDark() ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.classList.toggle(
      this.darkClass,
      theme === 'dark',
    );
  }
  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    this.theme.set(savedTheme || 'light');
    this.applyTheme(this.theme());
  }
}
