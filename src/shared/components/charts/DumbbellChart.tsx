import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import { chart } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';
import { ChartLegend, type SeriesDef } from './ChartLegend';
import type { ChartRow } from './TrendLineChart';
import styles from './DumbbellChart.module.css';

interface DumbbellChartProps {
    /** One row per category, with `id`, `label` and a field for each of the two series. */
    data: ChartRow[];
    /** Exactly two series, e.g. men and women. */
    series: readonly [SeriesDef, SeriesDef];
    format: ValueFormat;
    ariaLabel: string;
}

/** Room on both ends of the scale so the outer dots aren't cut in half. */
const EDGE_PADDING = 0.06;

/**
 * Two dots per category joined by a bar: the length of the bar *is* the gap between them.
 * Made for "how far apart are men and women at each age?". The scale runs from the smallest
 * to the largest value (not from zero), so the gaps use the full width of the card.
 */
export function DumbbellChart({ data, series, format, ariaLabel }: DumbbellChartProps) {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const [a, b] = series;

    const values = data.flatMap((row) => [row[a.key], row[b.key]]).filter((v): v is number => typeof v === 'number');
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;
    const position = (value: number) => EDGE_PADDING + ((value - min) / range) * (1 - EDGE_PADDING * 2);

    return (
        <div className={styles.frame}>
            <ChartLegend series={series} />
            <ul className={styles.list} aria-label={ariaLabel}>
                {data.map((row) => {
                    const va = row[a.key];
                    const vb = row[b.key];
                    const both = typeof va === 'number' && typeof vb === 'number';
                    return (
                        <li key={String(row.id)}>
                            <div className={styles.meta}>
                                <span className={styles.label}>{row.label}</span>
                                <span className={styles.values}>
                                    {[a, b].map((s) => {
                                        const value = row[s.key];
                                        return (
                                            <span key={s.key} className={styles.value}>
                                                <SaduMarker size={chart.legendMarkerSize} color={s.color} />
                                                <span className={styles.srOnly}>{s.label}: </span>
                                                {formatValue(typeof value === 'number' ? value : null, format, lang)}
                                            </span>
                                        );
                                    })}
                                    {both && (
                                        <span className={styles.gap}>
                                            {t('common.gap', { value: formatValue(Math.abs(va - vb), format, lang) })}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className={styles.track}>
                                {both && (
                                    <span
                                        className={styles.connector}
                                        aria-hidden
                                        style={
                                            {
                                                '--from': Math.min(position(va), position(vb)),
                                                '--to': Math.max(position(va), position(vb)),
                                            } as CSSProperties
                                        }
                                    />
                                )}
                                {[a, b].map((s) => {
                                    const value = row[s.key];
                                    if (typeof value !== 'number') return null;
                                    return (
                                        <span
                                            key={s.key}
                                            className={styles.dot}
                                            aria-hidden
                                            style={{ '--at': position(value) } as CSSProperties}
                                        >
                                            <SaduMarker size={chart.markerSize + 4} color={s.color} />
                                        </span>
                                    );
                                })}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}