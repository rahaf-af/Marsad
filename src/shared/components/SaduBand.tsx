import { useId } from 'react';
import styles from './SaduBand.module.css';

/** The hero's Sadu tile is drawn on a 32px grid; the band shrinks it to fit its height. */
const TILE = 32;

/**
 * A thin strip of the same Al Sadu motif as the page hero (see SaduPattern): an outlined
 * diamond with a filled diamond inside and small triangles at the corners, repeated in a row.
 * It takes the current text color, so the parent sets its color.
 */
export function SaduBand({ className, height = 12 }: { className?: string; height?: number }) {
    const id = useId();
    const scale = height / TILE;

    return (
        <svg
            className={className ? `${styles.band} ${className}` : styles.band}
            height={height}
            aria-hidden
            focusable="false"
        >
            <defs>
                <pattern
                    id={id}
                    width={TILE}
                    height={TILE}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`scale(${scale})`}
                >
                    <path className={styles.stroke} d="M16 2 L30 16 L16 30 L2 16 Z" />
                    <path d="M16 9 L23 16 L16 23 L9 16 Z" />
                    <path d="M0 0 L5 0 L0 5 Z M32 0 L27 0 L32 5 Z M0 32 L5 32 L0 27 Z M32 32 L27 32 L32 27 Z" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}