import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { RankedRow } from '../../shared/components/charts/BarList';
import { ChartCard } from '../../shared/components/ChartCard';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { formatNumber, formatPercent } from '../../shared/lib/format';
import { toLoadStatus, type AsyncResult } from '../../shared/lib/queryStatus';
import styles from './RegionTiles.module.css';

interface RegionTilesProps {
    title: string;
    description: string;
    query: AsyncResult<unknown>;
    rows: readonly RankedRow[];
    color: string;
    /** Controls next to the title, e.g. the tiles / table switch. */
    extra?: ReactNode;
}

/** Tint range: the lowest region gets the lightest tile, the highest the deepest. */
const MIN_TINT = 8;
const MAX_TINT = 45;

/**
 * One tile per region, ranked, shaded by its value like a heat map: the whole kingdom at a glance.
 * The tint stops at 45% so the text on every tile keeps enough contrast in both themes.
 *
 * The top region gets a double-size tile (2×2). With 13 regions that makes 16 cells, which fills
 * 8, 4 or 2 columns exactly, so there's never a half-empty last row.
 */
export function RegionTiles({ title, description, query, rows, color, extra }: RegionTilesProps) {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    const ranked = rows
        .filter((row): row is RankedRow & { value: number } => row.value != null)
        .sort((a, b) => b.value - a.value);
    const values = ranked.map((row) => row.value);
    const min = Math.min(...values);
    const range = Math.max(...values) - min || 1;

    return (
        <ChartCard
            title={title}
            description={description}
            extra={extra}
            status={toLoadStatus(query, () => ranked.length === 0)}
            error={query.error}
            onRetry={() => void query.refetch()}
            fitContent
            skeletonRows={8}
        >
            <div
                className={styles.body}
                style={
                    { '--tile-color': color, '--tile-min': `${MIN_TINT}%`, '--tile-max': `${MAX_TINT}%` } as CSSProperties
                }
            >
                <ol className={styles.grid} aria-label={title}>
                    {ranked.map((row, index) => {
                        const tint = MIN_TINT + ((row.value - min) / range) * (MAX_TINT - MIN_TINT);
                        return (
                            <li
                                key={row.id}
                                className={index === 0 ? `${styles.tile} ${styles.featured}` : styles.tile}
                                style={{ '--tile-tint': `${tint}%` } as CSSProperties}
                            >
                                <span className={styles.rank}>{formatNumber(index + 1, lang)}</span>
                                <span className={styles.name}>{row.label}</span>
                                <span className={styles.value}>{formatPercent(row.value, lang)}</span>
                            </li>
                        );
                    })}
                </ol>
                <div className={styles.scale} aria-hidden>
                    <span>{t('regions.tiles.low')}</span>
                    <span className={styles.gradient} />
                    <span>{t('regions.tiles.high')}</span>
                </div>
            </div>
        </ChartCard>
    );
}