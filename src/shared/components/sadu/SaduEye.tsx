import { steppedCorners, steppedDiamond, steppedDiamondOutline } from './saduShapes';
import styles from './SaduEye.module.css';

/** The eye is drawn on a 22-stitch square, centered. */
export const EYE_STITCHES = 22;
const C = EYE_STITCHES / 2;

/**
 * The Sadu eye (ʿayn) exactly as woven in the main row of SaduWeave: a light stepped ring,
 * a mid-green ring inside it and a white diamond at the heart. `corners` adds the small
 * stepped triangles that join neighbouring eyes into a chain (used inside the band).
 */
export function SaduEyeMotif({ unit, corners = false }: { unit: number; corners?: boolean }) {
    return (
        <>
            <path className={styles.light} fillRule="evenodd" d={steppedDiamondOutline(C, C, 9, 1, unit)} />
            <path className={styles.mid} fillRule="evenodd" d={steppedDiamondOutline(C, C, 6, 1, unit)} />
            <path className={styles.white} d={steppedDiamond(C, C, 3, unit)} />
            {corners && <path className={styles.mid} d={steppedCorners(EYE_STITCHES, 4, unit)} />}
        </>
    );
}

/**
 * One eye on its own, on a woven green diamond, e.g. as a marker on a timeline.
 * `size` is the width and height in px.
 */
export function SaduEye({ size, className }: { size: number; className?: string }) {
    const unit = size / EYE_STITCHES;
    return (
        <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden focusable="false">
            <path className={styles.base} d={steppedDiamond(C, C, 10, unit)} />
            <SaduEyeMotif unit={unit} />
        </svg>
    );
}