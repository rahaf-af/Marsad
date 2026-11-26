import type { Language } from '../i18n/languages';

/**
 * Number formatting for both languages.
 * "ar-SA" shows Arabic-Indic digits (٦٫٥٪). To use Western digits in Arabic (6.5٪),
 * change it to "ar-SA-u-nu-latn".
 */
const LOCALES: Record<Language, string> = {
    ar: 'ar-SA',
    en: 'en-US',
};

export const EMPTY_VALUE = '—';

// Intl formatters are expensive to create, so each configuration is built once and reused.
const cache = new Map<string, Intl.NumberFormat>();

function formatter(lang: Language, options: Intl.NumberFormatOptions): Intl.NumberFormat {
    const key = `${lang}|${JSON.stringify(options)}`;
    let instance = cache.get(key);
    if (!instance) {
        instance = new Intl.NumberFormat(LOCALES[lang], options);
        cache.set(key, instance);
    }
    return instance;
}

type Value = number | null | undefined;

/** 6.5 -> "6.5%" / "٦٫٥٪". The data stores percentages as 0–100. */
export function formatPercent(value: Value, lang: Language, digits = 1): string {
    if (value == null) return EMPTY_VALUE;
    return formatter(lang, {
        style: 'percent',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value / 100);
}

/** 10483 -> "SAR 10,483" / "١٠٬٤٨٣ ر.س." */
export function formatCurrency(value: Value, lang: Language): string {
    if (value == null) return EMPTY_VALUE;
    return formatter(lang, {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatNumber(value: Value, lang: Language, digits = 0): string {
    if (value == null) return EMPTY_VALUE;
    return formatter(lang, { maximumFractionDigits: digits }).format(value);
}

/** Change between two percentages, always signed: +0.4 / −1.2 */
export function formatChange(value: Value, lang: Language, digits = 1): string {
    if (value == null) return EMPTY_VALUE;
    return formatter(lang, {
        signDisplay: 'exceptZero',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);
}

/** Years without thousands separators: 2026 / ٢٠٢٦ */
export function formatYear(year: number, lang: Language): string {
    return formatter(lang, { useGrouping: false }).format(year);
}

/** "2026-Q2" -> { year: 2026, quarter: 2 } */
export function parsePeriod(period: string): { year: number; quarter: 1 | 2 | 3 | 4 } {
    const [year, q] = period.split('-Q');
    return { year: Number(year), quarter: Number(q) as 1 | 2 | 3 | 4 };
}

/** Short axis labels: 10483 -> "10K" / "١٠ ألف" */
export function formatCompact(value: Value, lang: Language): string {
    if (value == null) return EMPTY_VALUE;
    return formatter(lang, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export type ValueFormat = 'percent' | 'currency';

/** Full value, for tooltips and tables. */
export function formatValue(value: Value, format: ValueFormat, lang: Language): string {
    return format === 'percent' ? formatPercent(value, lang) : formatCurrency(value, lang);
}

/** Short value, for axis ticks. */
export function formatAxisValue(value: Value, format: ValueFormat, lang: Language): string {
    return format === 'percent' ? formatPercent(value, lang, 0) : formatCompact(value, lang);
}