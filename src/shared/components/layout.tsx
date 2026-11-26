import type { ReactNode } from 'react';
import { layout } from '../theme/tokens';
import { ResponsiveGrid } from './ResponsiveGrid';
import styles from './layout.module.css';

/** Vertical rhythm for a page: every section gets the same gap. */
export function PageStack({ children }: { children: ReactNode }) {
    return <div className={styles.stack}>{children}</div>;
}

/** KPI cards: 4 across on desktop, 2 on tablet, 1 on phone. */
export function KpiGrid({ children }: { children: ReactNode }) {
    return <ResponsiveGrid minColumnWidth={layout.kpiMinWidth}>{children}</ResponsiveGrid>;
}

/** Chart cards: 2 across on desktop, stacked below that. */
export function ChartGrid({ children }: { children: ReactNode }) {
    return <ResponsiveGrid minColumnWidth={layout.chartMinWidth}>{children}</ResponsiveGrid>;
}