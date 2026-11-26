export const LANGUAGES = ['ar', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Normalizes anything i18next reports ("en-US", undefined, …) to a supported language. */
export function toLanguage(value: string | undefined): Language {
    return value?.startsWith('en') ? 'en' : 'ar';
}

/** A text that exists in both languages, as in meta.json. */
export type LocalizedText = Record<Language, string>;