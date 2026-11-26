import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { chart } from '../../shared/theme/tokens';
import { indicatorWithChange, recentValues } from './selectors';
import type { Gender, Nationality, TimeseriesIndicator, TimeseriesPoint } from './types';

/**
 * Everything a KpiCard needs for one indicator at one period: the value, the change from
 * the previous quarter with its label, and the recent trend for the sparkline.
 * Spread the result straight into <KpiCard {...kpi('unemployment_rate', 'saudi', 'total')} />.
 */
export function useKpi(series: readonly TimeseriesPoint[], period: string) {
    const { t } = useTranslation();
    const periodLabel = usePeriodLabel();

    return useCallback(
        (indicator: TimeseriesIndicator, nationality: Nationality, gender: Gender) => {
            const { value, change, previousPeriod } = indicatorWithChange(series, period, indicator, nationality, gender);
            return {
                value,
                change,
                comparisonLabel: previousPeriod ? t('common.comparedTo', { period: periodLabel(previousPeriod) }) : undefined,
                trend: recentValues(series, period, indicator, nationality, gender, chart.sparklinePoints),
            };
        },
        [series, period, t, periodLabel],
    );
}