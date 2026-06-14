import { Provider } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export function provideI18n(): Provider[] {
  return [
    ...provideTranslateService({ lang: 'en' }),
    ...provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
  ];
}
