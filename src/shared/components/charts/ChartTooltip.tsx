import { useLanguage } from '../../i18n/useLanguage';
import { formatValue, type ValueFormat } from '../../lib/format';
import { chart } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';
import styles from './ChartTooltip.module.css';

interface TooltipEntry {
    name?: unknown;
    value?: unknown;
    color?: string;
    dataKey?: unknown;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: ReadonlyArray<TooltipEntry>;
    label?: unknown;
    format: ValueFormat;
    /** Turns the raw x value (e.g. "2026-Q2") into a readable title. */
    labelFormatter?: (label: string) => string;
}

/** Themed tooltip shared by all charts, each series marked with a Sadu eye. Missing values show as "—", never as 0. */
export function ChartTooltip({ active, payload, label, format, labelFormatter }: ChartTooltipProps) {
    const { lang, dir } = useLanguage();
    if (!active || !payload?.length) return null;

    const title = labelFormatter ? labelFormatter(String(label)) : String(label ?? '');

    return (
        // The chart's SVG area is LTR (see useChartSettings); the tooltip text follows the page.
        <div className={styles.tooltip} dir={dir}>
            <div className={styles.label}>{title}</div>
            {payload.map((entry) => (
                <div key={String(entry.dataKey ?? entry.name)} className={styles.row}>
                    <SaduMarker size={chart.legendMarkerSize} color={entry.color ?? 'currentColor'} />
                    <span className={styles.name}>{String(entry.name ?? '')}</span>
                    <span className={styles.value}>
                        {formatValue(typeof entry.value === 'number' ? entry.value : null, format, lang)}
                    </span>
                </div>
            ))}
        </div>
    );
}