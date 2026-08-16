import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import skTranslation from './locales/sk/translation.json';

i18n
    .use(LanguageDetector) // Automatically detects the browser's language
    .use(initReactI18next)
    .init({
        resources: {
        en: { translation: enTranslation },
        sk: { translation: skTranslation },
        },
        fallbackLng: 'en', // Alternative language if the key is not found
        interpolation: {
        escapeValue: false, // React Already Provides Protection Against XSS
        },
    });

export default i18n;