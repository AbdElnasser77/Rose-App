import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Language, LanguageOption } from '../models/language.model';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);

  initialize(): void {
    const lang = (this.document.defaultView?.localStorage.getItem('lang') || 'en') as Language;
    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    const option = LANGUAGES.find(l => l.code === lang);
    this.translate.use(lang);
    this.document.defaultView?.localStorage.setItem('lang', lang);
    this.document.documentElement.dir = option?.dir ?? 'ltr';
  }

  getCurrentLanguage(): Language {
    return (this.translate.currentLang() ?? 'en') as Language;
  }
}
