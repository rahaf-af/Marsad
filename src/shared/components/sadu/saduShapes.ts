/**
 * Al Sadu is woven, so its shapes are built from small square stitches: diagonals are
 * staircases, not smooth lines. These helpers draw shapes on a stitch grid and return SVG
 * path data, so every Sadu motif in the app has the same hand-woven look.
 *
 * All positions and sizes are in stitches; `unit` is the size of one stitch in px.
 */

/** A run of stitches on one row: `width` stitches starting at (x, y). */
export interface StitchRow {
    x: number;
    y: number;
    width: number;
}

/** One row of stitches as SVG path data. */
function row(x: number, y: number, width: number, unit: number): string {
    return `M${x * unit} ${y * unit}h${width * unit}v${unit}h${-width * unit}Z`;
}

/** The rows of a solid stepped diamond, `radius` stitches from its center to each point. */
export function diamondRows(cx: number, cy: number, radius: number): StitchRow[] {
    const rows: StitchRow[] = [];
    for (let i = 0; i < radius * 2; i += 1) {
        const fromMiddle = i < radius ? radius - 1 - i : i - radius;
        const half = radius - fromMiddle;
        rows.push({ x: cx - half, y: cy - radius + i, width: half * 2 });
    }
    return rows;
}

/** The rows of a stepped diamond outline: each row of the diamond minus the hole inside it. */
export function diamondOutlineRows(cx: number, cy: number, radius: number, thickness: number): StitchRow[] {
    const holes = new Map(diamondRows(cx, cy, radius - thickness).map((hole) => [hole.y, hole]));
    return diamondRows(cx, cy, radius).flatMap((outer) => {
        const hole = holes.get(outer.y);
        if (!hole) return [outer];
        return [
            { x: outer.x, y: outer.y, width: hole.x - outer.x },
            { x: hole.x + hole.width, y: outer.y, width: outer.x + outer.width - (hole.x + hole.width) },
        ];
    });
}

/** A solid stepped diamond, `radius` stitches from its center to each point. */
export function steppedDiamond(cx: number, cy: number, radius: number, unit: number): string {
    return diamondRows(cx, cy, radius)
        .map((r) => row(r.x, r.y, r.width, unit))
        .join('');
}

/**
 * A stepped diamond outline `thickness` stitches wide. Draw it with fill-rule="evenodd":
 * the inner diamond cuts the hole.
 */
export function steppedDiamondOutline(
    cx: number,
    cy: number,
    radius: number,
    thickness: number,
    unit: number,
): string {
    return steppedDiamond(cx, cy, radius, unit) + steppedDiamond(cx, cy, radius - thickness, unit);
}

/** A stepped triangle `height` stitches tall, its base on `baseY`, pointing down or up. */
export function steppedTriangle(
    cx: number,
    baseY: number,
    height: number,
    direction: 'down' | 'up',
    unit: number,
): string {
    let d = '';
    for (let i = 0; i < height; i += 1) {
        const half = height - i;
        const y = direction === 'down' ? baseY + i : baseY - 1 - i;
        d += row(cx - half, y, half * 2, unit);
    }
    return d;
}

/** Four stepped corner triangles, `size` stitches each, filling the corners of a square tile. */
export function steppedCorners(tile: number, size: number, unit: number): string {
    let d = '';
    for (let i = 0; i < size; i += 1) {
        const width = size - i;
        d += row(0, i, width, unit); // top start
        d += row(tile - width, i, width, unit); // top end
        d += row(0, tile - 1 - i, width, unit); // bottom start
        d += row(tile - width, tile - 1 - i, width, unit); // bottom end
    }
    return d;
}