import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationPT from './locales/pt-br.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    resources: {
      en: { translation: translationEN },
      'pt-BR': { translation: translationPT },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
