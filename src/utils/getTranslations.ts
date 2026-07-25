import es from '../i18n/es.json';
import en from '../i18n/en.json';

export type Language = 'es' | 'en';

export function getTranslations(lang: Language) {
  switch (lang) {
    case 'es':
      return es;
    case 'en':
    default:
      return en;
  }
}
