import { Children, type CSSProperties, type ReactNode } from 'react';
import { layout } from '../theme/tokens';
import { ResponsiveGrid } from './ResponsiveGrid';
import styles from './layout.module.css';

/** The most KPI cards that sit in one row on a wide screen. */
const MAX_KPI_COLUMNS = 4;

/** Vertical rhythm for a page: every section gets the same gap. */
export function PageStack({ children }: { children: ReactNode }) {
    return <div className={styles.stack}>{children}</div>;
}

/**
 * KPI cards: all in one row on desktop, 2 across on tablet, 1 on phone.
 * Column counts are fixed rather than auto-fit, so 4 cards never break into 3 + 1
 * (an iPad is just wide enough for 3). With an odd count, the first card spans the
 * tablet row so the rest pair up evenly.
 */
export function KpiGrid({ children }: { children: ReactNode }) {
    const count = Children.toArray(children).filter(Boolean).length;
    const columns = Math.min(Math.max(count, 1), MAX_KPI_COLUMNS);
    return (
        <div
            className={`${styles.kpiGrid} ${count % 2 === 1 ? styles.odd : ''}`}
            style={{ '--kpi-columns': columns } as CSSProperties}
        >
            {children}
        </div>
    );
}

/** Chart cards: 2 across on desktop, stacked below that. */
export function ChartGrid({ children }: { children: ReactNode }) {
    return <ResponsiveGrid minColumnWidth={layout.chartMinWidth}>{children}</ResponsiveGrid>;
}