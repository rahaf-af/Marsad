import type { ReactNode } from 'react';
import { ChartCard } from '../../../shared/components/ChartCard';
import { TrendLineChart, type TrendVariant } from '../../../shared/components/charts/TrendLineChart';
import { usePeriodLabel, useShortPeriodLabel } from '../../../shared/i18n/usePeriodLabel';
import type { ValueFormat } from '../../../shared/lib/format';
import { toLoadStatus, type AsyncResult } from '../../../shared/lib/queryStatus';
import { trendRows } from '../selectors';
import type { TimeseriesPoint } from '../types';
import type { TrendLine } from '../useSeriesStyles';

interface TrendChartCardProps {
    title: string;
    description?: string;
    extra?: ReactNode;
    query: AsyncResult<TimeseriesPoint[]>;
    /** Build these with useSeriesStyles(): nationalityLines, genderLines or sectorLines. */
    lines: readonly TrendLine[];
    format?: ValueFormat;
    variant?: TrendVariant;
}

/** A ChartCard with a quarter-by-quarter TrendLineChart from timeseries.json. */
export function TrendChartCard({
    title,
    description,
    extra,
    query,
    lines,
    format = 'percent',
    variant,
}: TrendChartCardProps) {
    const periodLabel = usePeriodLabel();
    const shortPeriod = useShortPeriodLabel();

    return (
        <ChartCard
            title={title}
            description={description}
            extra={extra}
            status={toLoadStatus(query)}
            error={query.error}
            onRetry={() => void query.refetch()}
        >
            <TrendLineChart
                data={trendRows(query.data ?? [], lines)}
                xKey="period"
                series={lines}
                format={format}
                variant={variant}
                xTickFormatter={shortPeriod}
                xLabelFormatter={periodLabel}
                ariaLabel={title}
            />
        </ChartCard>
    );
}