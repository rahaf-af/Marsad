import type { ReactNode } from 'react';
import type { ValueFormat } from '../../lib/format';
import { toLoadStatus, type AsyncResult } from '../../lib/queryStatus';
import { ChartCard } from '../ChartCard';
import { BarList, type RankedRow } from './BarList';

interface RankedChartCardProps {
    title: string;
    description?: string;
    extra?: ReactNode;
    /** The query the rows come from; drives the loading and error states. */
    query: AsyncResult<unknown>;
    rows: readonly RankedRow[];
    color: string;
    format: ValueFormat;
    keepOrder?: boolean;
    emptyMessage?: string;
    /** Rows to make room for while loading, so the page doesn't jump. */
    expectedRows?: number;
}

/** A ChartCard with a BarList inside. The card is as tall as its rows. */
export function RankedChartCard({
    title,
    description,
    extra,
    query,
    rows,
    color,
    format,
    keepOrder,
    emptyMessage,
    expectedRows = 10,
}: RankedChartCardProps) {
    return (
        <ChartCard
            title={title}
            description={description}
            extra={extra}
            status={toLoadStatus(query, () => rows.every((row) => row.value == null))}
            error={query.error}
            onRetry={() => void query.refetch()}
            emptyMessage={emptyMessage}
            fitContent
            skeletonRows={expectedRows}
        >
            <BarList rows={rows} color={color} format={format} ariaLabel={title} keepOrder={keepOrder} />
        </ChartCard>
    );
}