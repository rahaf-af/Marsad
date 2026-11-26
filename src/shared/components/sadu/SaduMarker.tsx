import { steppedDiamond, steppedDiamondOutline } from './saduShapes';

/** The marker is the Sadu "eye" on an 8-stitch grid: a stepped ring around a stepped diamond. */
const STITCHES = 8;
const CENTER = STITCHES / 2;

interface SaduMarkerShapeProps {
    /** Center of the marker, in the parent SVG's units. */
    cx: number;
    cy: number;
    /** Width and height in px. */
    size: number;
    color: string;
    /** A ring in the card color around it, so it stands out on top of a line. */
    halo?: boolean;
}

/**
 * The Sadu eye as a marker inside an existing SVG (e.g. a chart's active point).
 * Same stitched motif as the page pattern and the logo, so data points carry the identity.
 */
export function SaduMarkerShape({ cx, cy, size, color, halo = false }: SaduMarkerShapeProps) {
    const unit = size / STITCHES;
    const haloUnit = unit * 1.4;
    return (
        <g pointerEvents="none">
            {halo && (
                <path
                    transform={`translate(${cx - CENTER * haloUnit} ${cy - CENTER * haloUnit})`}
                    d={steppedDiamond(CENTER, CENTER, CENTER, haloUnit)}
                    style={{ fill: 'var(--m-surface)' }}
                />
            )}
            <g transform={`translate(${cx - size / 2} ${cy - size / 2})`} style={{ fill: color }}>
                <path fillRule="evenodd" d={steppedDiamondOutline(CENTER, CENTER, CENTER, 1, unit)} />
                <path d={steppedDiamond(CENTER, CENTER, 2, unit)} />
            </g>
        </g>
    );
}

/** The same marker as its own small image, for HTML (legends, KPI cards). */
interface SaduMarkerProps {
    size: number;
    color: string;
    className?: string;
    /**
     * eye (default): the ring-and-center eye, for series markers.
     * solid: a filled stepped diamond with a thin edge, for color keys where the fill itself
     * carries the meaning (shades in a donut or a 100% bar) and must stay visible when light.
     */
    variant?: 'eye' | 'solid';
}

/** The same marker as its own small image, for HTML (legends, keys, KPI cards). */
export function SaduMarker({ size, color, className, variant = 'eye' }: SaduMarkerProps) {
    const unit = size / STITCHES;
    return (
        <svg className={className} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden focusable="false">
            {variant === 'eye' ? (
                <SaduMarkerShape cx={size / 2} cy={size / 2} size={size} color={color} />
            ) : (
                <>
                    <path d={steppedDiamond(CENTER, CENTER, CENTER, unit)} style={{ fill: color }} />
                    <path
                        fillRule="evenodd"
                        d={steppedDiamondOutline(CENTER, CENTER, CENTER, 1, unit)}
                        style={{ fill: `color-mix(in srgb, ${color}, var(--m-text) 25%)` }}
                    />
                </>
            )}
        </svg>
    );
}