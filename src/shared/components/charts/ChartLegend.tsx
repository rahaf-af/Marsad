import { chart } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';
import styles from './ChartLegend.module.css';

export interface SeriesDef {
    key: string;
    label: string;
    color: string;
}

/** Our own legend instead of Recharts', so it wraps nicely and follows RTL. Each series is marked with a Sadu eye. */
export function ChartLegend({ series }: { series: readonly SeriesDef[] }) {
    return (
        <ul className={styles.legend}>
            {series.map((s) => (
                <li key={s.key} className={styles.item}>
                    <SaduMarker size={chart.legendMarkerSize} color={s.color} />
                    {s.label}
                </li>
            ))}
        </ul>
    );
}