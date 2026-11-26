import { Skeleton } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import type { LoadStatus } from '../lib/queryStatus';
import { DataUnavailable } from './DataUnavailable';
import { ErrorAlert } from './ErrorAlert';
import { SectionCard } from './SectionCard';
import styles from './ChartCard.module.css';

interface ChartCardProps {
    title: string;
    description?: string;
    /** Controls for the chart, e.g. a nationality switch. They wrap below on narrow screens. */
    extra?: ReactNode;
    /** Use toLoadStatus(query) from shared/lib/queryStatus. */
    status: LoadStatus;
    error?: unknown;
    onRetry?: () => void;
    /** Explains an empty state, e.g. "Published from 2024 onwards". */
    emptyMessage?: string;
    /** Desktop height in px; defaults to the chartHeight token. Phones get 80% of it. */
    height?: number;
    /** For content with its own natural height (lists, tiles) instead of a fixed-size chart. */
    fitContent?: boolean;
    /** Skeleton lines shown while loading. */
    skeletonRows?: number;
    children?: ReactNode;
}

/**
 * Frame for every chart. It owns the loading / error / empty states,
 * so chart components only ever render real data.
 */
export function ChartCard({
    title,
    description,
    extra,
    status,
    error,
    onRetry,
    emptyMessage,
    height,
    fitContent = false,
    skeletonRows = 7,
    children,
}: ChartCardProps) {
    let body: ReactNode;
    if (status === 'loading') {
        body = <Skeleton active title={false} paragraph={{ rows: skeletonRows }} />;
    } else if (status === 'error') {
        body = (
            <div className={styles.centered}>
                <ErrorAlert error={error} onRetry={onRetry} />
            </div>
        );
    } else if (status === 'empty') {
        body = (
            <div className={styles.centered}>
                <DataUnavailable message={emptyMessage} />
            </div>
        );
    } else {
        body = children;
    }

    return (
        <SectionCard title={title} description={description} extra={extra}>
            <div
                className={fitContent ? `${styles.chartArea} ${styles.fit}` : styles.chartArea}
                style={height ? ({ '--chart-height': `${height}px` } as CSSProperties) : undefined}
                aria-busy={status === 'loading'}
            >
                {body}
            </div>
        </SectionCard>
    );
}