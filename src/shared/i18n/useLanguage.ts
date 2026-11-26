import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toLanguage, type Language } from './languages';
import { withViewTransition } from '../lib/viewTransition';

export function useLanguage() {
    const { i18n } = useTranslation();
    const lang = toLanguage(i18n.resolvedLanguage);
    const dir = i18n.dir(lang);

    const setLanguage = useCallback(
        (next: Language) => {
            // Cross-fade into the other language (and direction) instead of flipping in one frame.
            withViewTransition(async () => {
                await i18n.changeLanguage(next);
            });
        },
        [i18n],
    );

    const toggleLanguage = useCallback(() => {
        setLanguage(lang === 'ar' ? 'en' : 'ar');
    }, [lang, setLanguage]);

    return { lang, dir, setLanguage, toggleLanguage };
}