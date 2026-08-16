import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate',
})
export class LocalizedDatePipe implements PipeTransform {
   
  transform(value: string | Date , lang: 'ar' | 'en' ): string {
    if(!value) return '';
    
   
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
