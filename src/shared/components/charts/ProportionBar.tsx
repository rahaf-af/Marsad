import { useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import type { RankedRow } from './BarList';
import styles from './ProportionBar.module.css';
import { chart } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';

interface ProportionBarProps {
    /** In their natural order (e.g. education levels, lowest to highest). */
    rows: readonly RankedRow[];
    color: string;
    format: ValueFormat;
    ariaLabel: string;
}

/** Shade of the first and last step: an ordered scale from light to the full series color. */
const FIRST_STEP = 18;
const LAST_STEP = 100;

/**
 * An ordered breakdown as one 100% bar: every level is a segment, shaded from light (first
 * level) to deep (last), so the shape of the whole distribution shows at a glance. The most
 * common level is called out on top, and a labelled key underneath gives every value.
 */
export function ProportionBar({ rows, color, format, ariaLabel }: ProportionBarProps) {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    const present = useMemo(
        () => rows.filter((row): row is RankedRow & { value: number } => row.value != null),
        [rows],
    );
    const total = present.reduce((sum, row) => sum + row.value, 0) || 1;
    const top = present.reduce<(typeof present)[number] | undefined>(
        (best, row) => (best == null || row.value > best.value ? row : best),
        undefined,
    );
    const step = (index: number) =>
        present.length > 1 ? FIRST_STEP + (index / (present.length - 1)) * (LAST_STEP - FIRST_STEP) : LAST_STEP;

    return (
        <div className={styles.frame} style={{ '--bar-color': color } as CSSProperties}>
            {top && (
                <p className={styles.headline}>
                    <span className={styles.headlineValue}>{formatValue(top.value, format, lang)}</span>
                    <span className={styles.headlineText}>{t('common.mostCommon', { label: top.label })}</span>
                </p>
            )}

            <div className={styles.bar} aria-hidden>
                {present.map((row, index) => (
                    <span
                        key={row.id}
                        className={styles.segment}
                        title={`${row.label}: ${formatValue(row.value, format, lang)}`}
                        style={{ flexGrow: row.value / total, '--step': `${step(index)}%` } as CSSProperties}
                    />
                ))}
            </div>

            <ol className={styles.key} aria-label={ariaLabel}>
                {present.map((row, index) => (
                    <li key={row.id} className={styles.keyItem}>
                        <SaduMarker
                            size={chart.keyMarkerSize}
                            color={`color-mix(in srgb, ${color} ${step(index)}%, var(--m-surface))`}
                            variant="solid"
                        />
                        <span className={styles.keyLabel}>{row.label}</span>
                        <span className={styles.keyValue}>{formatValue(row.value, format, lang)}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}