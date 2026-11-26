import { useId } from 'react';
import { EYE_STITCHES, SaduEyeMotif } from './SaduEye';
import { steppedTriangle } from './saduShapes';
import styles from './SaduWeave.module.css';

/** Size of one stitch in px. */
const UNIT = 3;
/** Longer than any card or screen; the svg clips whatever doesn't fit. */
const LENGTH = 4000;

type Kind = 'stripe' | 'gap' | 'teethDown' | 'teethUp' | 'eyes';
type Tone = 'base' | 'light' | 'mid';

interface Register {
    kind: Kind;
    /** Rows of stitches. */
    size: number;
    /** Color of the stripe or the teeth. */
    tone?: Tone;
}

/**
 * band: the full Sadu band, mirrored around the middle like the real weave: a border line,
 * a row of teeth (ḍurūs) pointing inwards, a thin line, then the main row of eyes (ʿuyūn).
 * edge: just the fringe, for the bottom of the page: teeth rising from a woven border,
 * with no background, so they stand on the page itself.
 */
const VARIANTS: Record<'band' | 'edge', readonly Register[]> = {
    band: [
        { kind: 'stripe', size: 1, tone: 'light' },
        { kind: 'gap', size: 1 },
        { kind: 'teethDown', size: 4, tone: 'light' },
        { kind: 'gap', size: 1 },
        { kind: 'stripe', size: 1, tone: 'mid' },
        { kind: 'gap', size: 1 },
        { kind: 'eyes', size: 22 },
        { kind: 'gap', size: 1 },
        { kind: 'stripe', size: 1, tone: 'mid' },
        { kind: 'gap', size: 1 },
        { kind: 'teethUp', size: 4, tone: 'light' },
        { kind: 'gap', size: 1 },
        { kind: 'stripe', size: 1, tone: 'light' },
    ],
    edge: [
        { kind: 'teethUp', size: 4, tone: 'base' },
        { kind: 'stripe', size: 2, tone: 'base' },
        { kind: 'stripe', size: 1, tone: 'light' },
        { kind: 'stripe', size: 1, tone: 'base' },
    ],
};

const TEETH_WIDTH = 8;

interface SaduWeaveProps {
    variant?: 'band' | 'edge';
    /** horizontal: across the top or bottom. vertical: down the side. */
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

/**
 * A woven Sadu strip drawn stitch by stitch, in the brand greens. It runs the full length
 * of its parent; its thickness comes from the variant (band 120px, edge 24px). Decorative.
 */
export function SaduWeave({ variant = 'band', orientation = 'horizontal', className }: SaduWeaveProps) {
    const id = useId();
    const registers = VARIANTS[variant];
    const thickness = registers.reduce((sum, register) => sum + register.size, 0) * UNIT;
    const vertical = orientation === 'vertical';
    const toneClass = { base: styles.base, light: styles.light, mid: styles.mid };
    let offset = 0;

    return (
        <svg
            className={`${styles.weave} ${vertical ? styles.vertical : styles.horizontal} ${className ?? ''}`}
            width={vertical ? thickness : undefined}
            height={vertical ? undefined : thickness}
            aria-hidden
            focusable="false"
        >
            <g transform={vertical ? `rotate(90) translate(0 ${-thickness})` : undefined}>
                {variant === 'band' && <rect className={styles.base} width={LENGTH} height={thickness} />}
                {registers.map(({ kind, size, tone = 'light' }, index) => {
                    const y = offset * UNIT;
                    const height = size * UNIT;
                    offset += size;
                    const key = `${kind}-${index}`;

                    if (kind === 'gap') return null;
                    if (kind === 'stripe') {
                        return <rect key={key} className={toneClass[tone]} y={y} width={LENGTH} height={height} />;
                    }

                    const patternId = `${id}-${key}`;
                    const tileWidth = (kind === 'eyes' ? EYE_STITCHES : TEETH_WIDTH) * UNIT;
                    return (
                        <g key={key}>
                            <pattern id={patternId} y={y} width={tileWidth} height={height} patternUnits="userSpaceOnUse">
                                {kind === 'teethDown' && (
                                    <path className={toneClass[tone]} d={steppedTriangle(TEETH_WIDTH / 2, 0, size, 'down', UNIT)} />
                                )}
                                {kind === 'teethUp' && (
                                    <path className={toneClass[tone]} d={steppedTriangle(TEETH_WIDTH / 2, size, size, 'up', UNIT)} />
                                )}
                                {kind === 'eyes' && <SaduEyeMotif unit={UNIT} corners />}
                            </pattern>
                            <rect y={y} width={LENGTH} height={height} fill={`url(#${patternId})`} />
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}