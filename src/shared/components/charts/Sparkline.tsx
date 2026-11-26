import type { CSSProperties } from 'react';
import { chart, layout } from '../../theme/tokens';
import { SaduMarker } from '../sadu/SaduMarker';
import styles from './Sparkline.module.css';

interface SparklineProps {
    /** Oldest first. Missing values break the line instead of dropping to zero. */
    values: readonly (number | null)[];
}

const WIDTH = 120;

/** A tiny trend line for KPI cards: shape only, no axes. Drawn in the brand green. */
export function Sparkline({ values }: SparklineProps) {
    const present = values.filter((v): v is number => v != null);
    if (present.length < 2) return null;

    const height = layout.sparklineHeight;
    const min = Math.min(...present);
    const max = Math.max(...present);
    const range = max - min || 1;
    const step = WIDTH / (values.length - 1);
    const pad = 3;

    // One path with a "move to" after every gap, so null values leave a break.
    let d = '';
    let penDown = false;
    let last = { x: 0, y: 0 };
    values.forEach((value, i) => {
        if (value == null) {
            penDown = false;
            return;
        }
        const x = i * step;
        const y = pad + (1 - (value - min) / range) * (height - pad * 2);
        d += `${penDown ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
        penDown = true;
        last = { x, y };
    });

    return (
        // Time always runs the same way as the page: the newest quarter is at the reading end.
        <div className={styles.wrap}>
            <svg className={styles.sparkline} viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="none" aria-hidden>
                <path d={d.trim()} className={styles.line} vectorEffect="non-scaling-stroke" />
            </svg>
            {/* The latest quarter as a Sadu eye. It sits on top in HTML, so the stretched svg can't distort it. */}
            <span
                className={styles.end}
                style={{ left: `${(last.x / WIDTH) * 100}%`, top: `${(last.y / height) * 100}%` } as CSSProperties}
            >
                <SaduMarker size={chart.markerSize} color="var(--m-chart-saudi)" />
            </span>
        </div>
    );
}