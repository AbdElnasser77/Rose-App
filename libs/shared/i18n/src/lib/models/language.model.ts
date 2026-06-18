export type Language = 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  label: string;
  dir: 'rtl' | 'ltr';
}