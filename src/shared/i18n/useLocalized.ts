import { useCallback } from 'react';
import type { LocalizedText } from './languages';
import { useLanguage } from './useLanguage';

/** Picks the right language from data labels: { ar: "الرياض", en: "Riyadh" } -> "الرياض" */
export function useLocalized() {
    const { lang } = useLanguage();
    return useCallback((text: LocalizedText) => text[lang], [lang]);
}