import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';
import { toLanguage } from './languages';

// Keep <html lang> and <html dir> in sync with the active language.
// Registered before init so the very first render already has the right direction.
i18n.on('languageChanged', (lng) => {
    const lang = toLanguage(lng);
    document.documentElement.lang = lang;
    document.documentElement.dir = i18n.dir(lang);
});

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: ar },
            en: { translation: en },
        },
        fallbackLng: 'ar',
        supportedLngs: ['ar', 'en'],
        load: 'languageOnly', // "en-US" from the browser becomes "en"
        interpolation: { escapeValue: false }, // React already escapes output
        detection: {
            // ?lang=en in the URL wins, then the saved choice, then the browser language.
            order: ['querystring', 'localStorage'],
            lookupQuerystring: 'lang',
            lookupLocalStorage: 'mersad-lang',
            caches: ['localStorage'],
        },
    });

export default i18n;