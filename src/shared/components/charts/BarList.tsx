import { useMemo, type CSSProperties } from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import styles from './BarList.module.css';

export interface RankedRow {
    id: string;
    label: string;
    value: number | null;
}

interface BarListProps {
    rows: readonly RankedRow[];
    color: string;
    format: ValueFormat;
    ariaLabel: string;
    /** Keep the given order instead of sorting high to low (e.g. education levels). */
    keepOrder?: boolean;
}

/**
 * A ranked list of categories: the name and value on one line, a bar underneath.
 * Plain HTML instead of an SVG chart, so long Arabic names wrap naturally, the layout follows
 * RTL by itself, and there's no fixed label column leaving empty space. Rows without a value
 * are left out rather than drawn as zero.
 */
export function BarList({ rows, color, format, ariaLabel, keepOrder = false }: BarListProps) {
    const { lang } = useLanguage();

    const data = useMemo(() => {
        const present = rows.filter((row): row is RankedRow & { value: number } => row.value != null);
        return keepOrder ? present : [...present].sort((a, b) => b.value - a.value);
    }, [rows, keepOrder]);

    // Bars are scaled to the largest value, so the top row always spans the full width.
    const max = Math.max(...data.map((row) => row.value), 0) || 1;

    return (
        <ol className={styles.list} aria-label={ariaLabel} style={{ '--bar-color': color } as CSSProperties}>
            {data.map((row) => (
                <li key={row.id}>
                    <div className={styles.meta}>
                        <span className={styles.label}>{row.label}</span>
                        <span className={styles.value}>{formatValue(row.value, format, lang)}</span>
                    </div>
                    <div className={styles.track} aria-hidden>
                        <div className={styles.bar} style={{ '--bar-size': row.value / max } as CSSProperties} />
                    </div>
                </li>
            ))}
        </ol>
    );
}