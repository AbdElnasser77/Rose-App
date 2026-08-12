import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(text: string,searchTerm: string): string {
    if(!searchTerm.trim()){
      return text;
    }
    const escapedTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const regex = new RegExp(`(${escapedTerm})`,'gi')
    return text.replace(
       regex,
       '<span class="text-[#A6252A] dark:text-soft-pink-200">$1</span>'
    );
  }
}
