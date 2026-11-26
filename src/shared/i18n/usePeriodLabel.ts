import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatYear, parsePeriod } from '../lib/format';
import { useLanguage } from './useLanguage';

/** Returns a function: "2026-Q2" -> "الربع الثاني ٢٠٢٦" / "Q2 2026" */
export function usePeriodLabel() {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    return useCallback(
        (period: string) => {
            const { year, quarter } = parsePeriod(period);
            return `${t(`quarter.${quarter}`)} ${formatYear(year, lang)}`;
        },
        [t, lang],
    );
}

/** Compact version for chart axes: "2026-Q2" -> "ر٢ ٢٠٢٦" / "Q2 2026" */
export function useShortPeriodLabel() {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    return useCallback(
        (period: string) => {
            const { year, quarter } = parsePeriod(period);
            return `${t('common.quarterShort', { q: formatNumber(quarter, lang) })} ${formatYear(year, lang)}`;
        },
        [t, lang],
    );
}