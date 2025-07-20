import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import hi from './translations/hi.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import zh from './translations/zh.json';
import fr from './translations/fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      pt: { translation: pt },
      zh: { translation: zh },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    lng: 'en', // default language
    interpolation: { escapeValue: false },
  });

export default i18n;
