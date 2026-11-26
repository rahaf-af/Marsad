import { chartColors, fontSize, layout, palette, radius, spacing, type ResolvedMode } from './tokens';

const toKebab = (value: string) => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const px = (value: number) => `${value}px`;

/**
 * Every token as a CSS variable name and value, e.g.
 *   --m-primary, --m-chart-saudi, --m-space-lg, --m-radius-md, --m-font-sm, --m-layout-max-width
 */
export function cssVariables(mode: ResolvedMode): Record<string, string> {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(palette[mode])) vars[`--m-${toKebab(key)}`] = value;
    for (const [key, value] of Object.entries(chartColors[mode])) vars[`--m-chart-${toKebab(key)}`] = value;
    for (const [key, value] of Object.entries(spacing)) vars[`--m-space-${key}`] = px(value);
    for (const [key, value] of Object.entries(radius)) vars[`--m-radius-${key}`] = px(value);
    for (const [key, value] of Object.entries(fontSize)) vars[`--m-font-${key}`] = px(value);
    for (const [key, value] of Object.entries(layout)) vars[`--m-layout-${toKebab(key)}`] = px(value);
    return vars;
}