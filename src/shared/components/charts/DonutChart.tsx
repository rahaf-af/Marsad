import { useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import type { RankedRow } from './BarList';
import styles from './DonutChart.module.css';
import { chart } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';

interface DonutChartProps {
    rows: readonly RankedRow[];
    color: string;
    format: ValueFormat;
    ariaLabel: string;
    /** Slices drawn, including "Other". Guides advise five at most; the rest are grouped. */
    maxSlices?: number;
}

interface Slice {
    id: string;
    label: string;
    value: number;
    /** For "Other": the names it groups. */
    members?: string[];
}

/** Shades of the series color for the named slices, largest first; "Other" is neutral. */
const SHADES = [100, 72, 50, 34];
/** Gap between slices, in percent of the ring. */
const GAP = 0.8;

/**
 * Parts of a whole as a ring: the biggest groups as slices in shades of the series color,
 * everything smaller gathered into one neutral "Other" slice so the ring stays readable.
 * The largest share sits in the middle; the key beside it gives every value and lists
 * what "Other" contains.
 */
export function DonutChart({ rows, color, format, ariaLabel, maxSlices = 5 }: DonutChartProps) {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    const slices = useMemo<Slice[]>(() => {
        const sorted = rows
            .filter((row): row is RankedRow & { value: number } => row.value != null && row.value > 0)
            .sort((a, b) => b.value - a.value);
        if (sorted.length <= maxSlices) return sorted;
        const named = sorted.slice(0, maxSlices - 1);
        const rest = sorted.slice(maxSlices - 1);
        return [
            ...named,
            {
                id: 'other',
                label: t('common.others'),
                value: rest.reduce((sum, row) => sum + row.value, 0),
                members: rest.map((row) => row.label),
            },
        ];
    }, [rows, maxSlices, t]);

    const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1;
    const largest = slices[0];
    const sliceColor = (slice: Slice, index: number) =>
        slice.members
            ? 'color-mix(in srgb, var(--m-text-secondary) 30%, var(--m-surface))'
            : `color-mix(in srgb, ${color} ${SHADES[index] ?? SHADES[SHADES.length - 1]}%, var(--m-surface))`;

    let offset = 0;

    return (
        <div className={styles.frame}>
            <div className={styles.donut}>
                {/* pathLength=100 lets each slice's dash length be its percentage of the ring. */}
                <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden>
                    <circle className={styles.track} cx="50" cy="50" r="40" />
                    {slices.map((slice, index) => {
                        const length = (slice.value / total) * 100;
                        const dash = Math.max(length - GAP, 0.1);
                        const start = offset;
                        offset += length;
                        return (
                            <circle
                                key={slice.id}
                                className={styles.slice}
                                cx="50"
                                cy="50"
                                r="40"
                                pathLength={100}
                                style={{
                                    stroke: sliceColor(slice, index),
                                    strokeDasharray: `${dash} ${100 - dash}`,
                                    strokeDashoffset: -start,
                                }}
                            >
                                <title>{`${slice.label}: ${formatValue(slice.value, format, lang)}`}</title>
                            </circle>
                        );
                    })}
                </svg>
                {largest && (
                    <div className={styles.center}>
                        <span className={styles.centerValue}>{formatValue(largest.value, format, lang)}</span>
                        <span className={styles.centerLabel}>{largest.label}</span>
                    </div>
                )}
            </div>

            <ol className={styles.key} aria-label={ariaLabel}>
                {slices.map((slice, index) => (
                    <li key={slice.id} className={styles.keyItem}>
                        <SaduMarker
                            className={styles.swatch}
                            size={chart.keyMarkerSize}
                            color={sliceColor(slice, index)}
                            variant="solid"
                        />
                        <span className={styles.keyText}>
                            <span className={styles.keyLabel}>{slice.label}</span>
                            {slice.members && (
                                <span className={styles.members}>
                                    {new Intl.ListFormat(lang, { type: 'conjunction' }).format(slice.members)}
                                </span>
                            )}
                        </span>
                        <span className={styles.keyValue}>{formatValue(slice.value, format, lang)}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}