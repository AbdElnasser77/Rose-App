import { inject, Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '@rose/i18n';

@Pipe({
  name: 'localizedDate',
})
export class LocalizedDatePipe implements PipeTransform {
   private languageService = inject(LanguageService);
   
  transform(value: string | Date ): string {
    if(!value) return '';
    
    const lang = this.languageService.getCurrentLanguage();
    return  new Intl.DateTimeFormat(
      lang === 'ar' ? 'ar-EG' : 'en-US',
      {

        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    ).format(new Date(value))
  }
}
