import { useId } from 'react';
import { EYE_STITCHES, SaduEyeMotif } from './sadu/SaduEye';
import styles from './Logo.module.css';

/** Each eye covers a quarter of the 32-unit logo, so four fit across (same grid as before). */
const EYE_TILE = 8;

/**
 * Marsad's mark: a brand-green tile woven with the eyes of the Sadu band, and a rising
 * trend line on top whose points are Sadu diamonds; the last point is the light-green one.
 * Drawn on a 32×32 grid; ids come from useId because the logo appears several times per page.
 */
export function Logo({ size = 28 }: { size?: number }) {
    const id = useId();
    const clipId = `${id}-clip`;
    const patternId = `${id}-sadu`;

    return (
        <svg className={styles.logo} width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false">
            <defs>
                <clipPath id={clipId}>
                    <rect width="32" height="32" rx="7.4" />
                </clipPath>
                {/* The woven eyes of the Sadu band (SaduWeave), four across the tile. */}
                <pattern id={patternId} width={EYE_TILE} height={EYE_TILE} patternUnits="userSpaceOnUse">
                    <SaduEyeMotif unit={EYE_TILE / EYE_STITCHES} corners />
                </pattern>
            </defs>
            <g clipPath={`url(#${clipId})`}>
                <rect className={styles.tile} width="32" height="32" />
                <rect className={styles.weave} width="32" height="32" fill={`url(#${patternId})`} />
            </g>
            <path className={styles.line} d="M6.3 24 L13.1 17.7 L19.4 20.6 L26.9 9.1" />
            <path
                className={styles.point}
                d="M6.3 21.7 L8.6 24 L6.3 26.3 L4 24 Z M13.1 15.4 L15.4 17.7 L13.1 20 L10.8 17.7 Z M19.4 18.3 L21.7 20.6 L19.4 22.9 L17.1 20.6 Z"
            />
            <path className={styles.accent} d="M26.9 6.2 L29.8 9.1 L26.9 12 L24 9.1 Z" />
        </svg>
    );
}