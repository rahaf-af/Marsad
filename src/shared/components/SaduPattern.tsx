import { useId } from 'react';
import { steppedCorners, steppedDiamond, steppedDiamondOutline } from './sadu/saduShapes';
import styles from './SaduPattern.module.css';

/** One repeat of the pattern is TILE stitches square; one stitch is UNIT px. */
const TILE = 16;
const UNIT = 2;
const CENTER = TILE / 2;

interface SaduPatternProps {
    /**
     * fade (default): covers the end side and fades out towards the text, as on the page hero.
     * cover: covers the whole parent evenly, for panels that are all pattern.
     */
    variant?: 'fade' | 'cover';
}

/**
 * Al Sadu "eyes" as an all-over pattern, drawn stitch by stitch like the real weave:
 * a stepped diamond outline around a solid diamond, with stepped triangles in the corners
 * that join into small diamonds between the tiles. The parent must be position: relative.
 */
export function SaduPattern({ variant = 'fade' }: SaduPatternProps) {
    const id = useId();
    const size = TILE * UNIT;

    return (
        <svg className={`${styles.pattern} ${styles[variant]}`} aria-hidden focusable="false">
            <defs>
                <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
                    <path className={styles.fill} fillRule="evenodd" d={steppedDiamondOutline(CENTER, CENTER, 7, 2, UNIT)} />
                    <path className={styles.fill} d={steppedDiamond(CENTER, CENTER, 3, UNIT)} />
                    <path className={styles.fill} d={steppedCorners(TILE, 3, UNIT)} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
}