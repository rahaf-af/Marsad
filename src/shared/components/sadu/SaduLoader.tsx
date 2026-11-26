import { diamondOutlineRows, diamondRows } from './saduShapes';
import styles from './SaduLoader.module.css';

/** The same 16-stitch eye as the page pattern; each stitch is UNIT px. */
const TILE = 16;
const UNIT = 4;
const CENTER = TILE / 2;
/** Delay between one woven row and the next, so the motif fills from top to bottom. */
const ROW_DELAY_MS = 70;

const STITCHES = [...diamondOutlineRows(CENTER, CENTER, 7, 2), ...diamondRows(CENTER, CENTER, 3)];

/** A Sadu eye being woven row by row, on a loop. Still (and fully drawn) with reduced motion. */
export function SaduLoader() {
    const size = TILE * UNIT;
    return (
        <svg className={styles.loader} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
            {STITCHES.map((stitch, index) => (
                <rect
                    key={index}
                    className={styles.stitch}
                    x={stitch.x * UNIT}
                    y={stitch.y * UNIT}
                    width={stitch.width * UNIT}
                    height={UNIT}
                    style={{ animationDelay: `${stitch.y * ROW_DELAY_MS}ms` }}
                />
            ))}
        </svg>
    );
}