import 'i18next';
import type ar from './locales/ar.json';

// Type-safe translation keys: a typo like t('nav.overvieww') becomes a TypeScript error.
// ar.json is the reference file, so every key must exist there first.
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof ar;
        };
    }
}