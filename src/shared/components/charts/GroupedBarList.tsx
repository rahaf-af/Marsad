import type { CSSProperties } from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import { ChartLegend, type SeriesDef } from './ChartLegend';
import type { ChartRow } from './TrendLineChart';
import styles from './GroupedBarList.module.css';

interface GroupedBarListProps {
    /** One row per category, with `id`, `label` and one field per series. */
    data: ChartRow[];
    series: readonly SeriesDef[];
    format: ValueFormat;
    ariaLabel: string;
}

/**
 * Each category with one bar per series under its name, e.g. men's and women's wage in a sector.
 * Every bar runs across the card and has its value at the end, so a short list still fills
 * the space instead of leaving thin bars in a wide, empty chart.
 */
export function GroupedBarList({ data, series, format, ariaLabel }: GroupedBarListProps) {
    const { lang } = useLanguage();
    const values = data.flatMap((row) => series.map((s) => row[s.key])).filter((v): v is number => typeof v === 'number');
    const max = Math.max(...values, 0) || 1;

    return (
        <div className={styles.frame}>
            <ChartLegend series={series} />
            <ul className={styles.list} aria-label={ariaLabel}>
                {data.map((row) => (
                    <li key={String(row.id)} className={styles.group}>
                        <span className={styles.label}>{row.label}</span>
                        {series.map((s) => {
                            const value = row[s.key];
                            const size = typeof value === 'number' ? value / max : 0;
                            return (
                                <div key={s.key} className={styles.line} style={{ '--bar-color': s.color } as CSSProperties}>
                                    <div className={styles.track} aria-hidden>
                                        <div className={styles.bar} style={{ '--bar-size': size } as CSSProperties} />
                                    </div>
                                    <span className={styles.value}>
                                        <span className={styles.srOnly}>{s.label}: </span>
                                        {formatValue(typeof value === 'number' ? value : null, format, lang)}
                                    </span>
                                </div>
                            );
                        })}
                    </li>
                ))}
            </ul>
        </div>
    );
}