import type { ReactNode } from 'react';
import type { ValueFormat } from '../../lib/format';
import { toLoadStatus, type AsyncResult } from '../../lib/queryStatus';
import { ChartCard } from '../ChartCard';
import type { SeriesDef } from './ChartLegend';
import { GroupedBarChart } from './GroupedBarChart';
import type { ChartRow } from './TrendLineChart';

interface GroupedChartCardProps {
    title: string;
    description?: string;
    extra?: ReactNode;
    query: AsyncResult<unknown>;
    data: ChartRow[];
    /** Field holding the category name. */
    xKey: string;
    series: readonly SeriesDef[];
    format: ValueFormat;
    emptyMessage?: string;
}

/** A ChartCard with a GroupedBarChart inside. Empty when no series has a value. */
export function GroupedChartCard({
    title,
    description,
    extra,
    query,
    data,
    xKey,
    series,
    format,
    emptyMessage,
}: GroupedChartCardProps) {
    const isEmpty = () => data.every((row) => series.every((s) => row[s.key] == null));

    return (
        <ChartCard
            title={title}
            description={description}
            extra={extra}
            status={toLoadStatus(query, isEmpty)}
            error={query.error}
            onRetry={() => void query.refetch()}
            emptyMessage={emptyMessage}
        >
            <GroupedBarChart data={data} xKey={xKey} series={series} format={format} ariaLabel={title} />
        </ChartCard>
    );
}