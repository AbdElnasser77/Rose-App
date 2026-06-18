import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'lib-language-switcher',
  imports: [],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);

  get label(): string {
    return this.languageService.getCurrentLanguage() === 'ar' ? 'English' : 'العربية';
  }

  toggle(): void {
    const current = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(current === 'ar' ? 'en' : 'ar');
  }
}
