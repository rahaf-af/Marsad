import type { CSSProperties, ReactNode } from 'react';
import styles from './ResponsiveGrid.module.css';

interface ResponsiveGridProps {
    children: ReactNode;
    /** Narrowest a column may get before the grid drops a column, in px. */
    minColumnWidth: number;
}

/**
 * Columns appear and disappear with the available width, no breakpoints needed.
 * Pages use the presets KpiGrid and ChartGrid instead of this directly.
 */
export function ResponsiveGrid({ children, minColumnWidth }: ResponsiveGridProps) {
    return (
        <div className={styles.grid} style={{ '--grid-min': `${minColumnWidth}px` } as CSSProperties}>
            {children}
        </div>
    );
}