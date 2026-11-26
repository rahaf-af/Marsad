import { useTranslation } from 'react-i18next';
import { useChartColors } from '../../shared/theme/useTheme';
import type { TrendSeriesSpec } from './selectors';
import type { Gender, Nationality, TimeseriesIndicator } from './types';

/** A line on a trend chart: what to plot, plus its legend name and color. */
export interface TrendLine extends TrendSeriesSpec {
    label: string;
    color: string;
}

/**
 * Series names and colors that mean the same thing on every chart:
 * Saudi is always green, women always rose, the private sector always blue, and so on.
 */
export function useSeriesStyles() {
    const { t } = useTranslation();
    const colors = useChartColors();

    const nationality = (n: Nationality) => ({
        label: t(`nationality.${n}`),
        color: n === 'saudi' ? colors.saudi : n === 'nonSaudi' ? colors.nonSaudi : colors.total,
    });

    const gender = (g: Gender) => ({
        label: t(`gender.${g}`),
        color: g === 'male' ? colors.male : g === 'female' ? colors.female : colors.total,
    });

    /** One line per nationality, e.g. Saudi vs non-Saudi unemployment. */
    const nationalityLines = (
        indicator: TimeseriesIndicator,
        g: Gender,
        nationalities: readonly Nationality[],
    ): TrendLine[] =>
        nationalities.map((n) => ({ key: n, indicator, nationality: n, gender: g, ...nationality(n) }));

    /** One line per gender, e.g. women vs men participation. */
    const genderLines = (indicator: TimeseriesIndicator, n: Nationality, genders: readonly Gender[]): TrendLine[] =>
        genders.map((g) => ({ key: g, indicator, nationality: n, gender: g, ...gender(g) }));

    /** Private vs public sector share of employed. */
    const sectorLines = (n: Nationality, g: Gender): TrendLine[] => [
        {
            key: 'private',
            indicator: 'private_sector_share',
            nationality: n,
            gender: g,
            label: t('series.privateSector'),
            color: colors.privateSector,
        },
        {
            key: 'public',
            indicator: 'public_sector_share',
            nationality: n,
            gender: g,
            label: t('series.publicSector'),
            color: colors.publicSector,
        },
    ];

    /** Bar series per gender for grouped bar charts. */
    const genderBars = (genders: readonly Gender[]) => genders.map((g) => ({ key: g, ...gender(g) }));

    return { nationality, gender, nationalityLines, genderLines, sectorLines, genderBars, colors };
}