/**
 * Mersad design tokens: the single source of truth for colors, spacing, sizes and fonts.
 * Change a value here and it updates everywhere: antd reads these through antdTheme.ts,
 * and CSS Modules read them as CSS variables (--m-space-lg, --m-primary, …) set by ThemeProvider.
 * Nothing else in the project should contain a hex color or a spacing number.
 */

export type ResolvedMode = 'light' | 'dark';

/* ---------- Brand ---------- */

/** Mersad green. #0E5E4B (brand700) is the main color; the rest are its tints and shades. */
export const brand = {
    900: '#082F26',
    800: '#0B4A3B',
    700: '#0E5E4B',
    600: '#14735C',
    500: '#1F8A6E',
    300: '#7FD8B8',
    100: '#E1F0EA',
    50: '#F2F8F5',
} as const;

/* ---------- Colors (change with light/dark) ---------- */

export const palette = {
    light: {
        /** Filled things: buttons, selected states, the main chart color. */
        primary: brand[700],
        /** Green used as text or lines on the page background (links, icons). */
        primaryText: brand[700],
        primarySoft: brand[100],
        gold: '#B0862F',
        background: brand[50],
        surface: '#FFFFFF',
        border: '#DCE6E1',
        text: '#14231F',
        textSecondary: '#4D5C58',
        success: '#1F6E43',
        error: '#A3301F',
        shadow: 'rgb(14 94 75 / 10%)',
        /** The header bar, one step darker than the hero so the two read as separate. */
        headerBg: brand[800],
        headerText: '#FFFFFF',
        headerAccent: brand[300],
        /** The green band at the top of each page, with the Sadu pattern. */
        heroBg: brand[700],
        heroText: '#FFFFFF',
        heroTextSecondary: '#CFE8DE',
        heroPattern: brand[300],
        /** The Sadu weave inside the logo tile. Same in both modes, so the logo never changes. */
        logoPattern: brand[500],
    },
    dark: {
        primary: brand[700],
        primaryText: brand[300],
        primarySoft: '#123B31',
        gold: '#E0BE72',
        background: '#0A1311',
        surface: '#121E1B',
        border: '#22332E',
        text: '#E8F0ED',
        textSecondary: '#A3B5AF',
        success: '#6FD49A',
        error: '#F08A7E',
        shadow: 'rgb(0 0 0 / 45%)',
        headerBg: brand[900],
        headerText: '#FFFFFF',
        headerAccent: brand[300],
        heroBg: brand[800],
        heroText: '#FFFFFF',
        heroTextSecondary: '#B8D9CC',
        heroPattern: brand[500],
    },
} as const satisfies Record<ResolvedMode, Record<string, string>>;

/**
 * Chart colors carry meaning and stay the same on every page:
 * Saudi is always the brand green, non-Saudi always gold, and so on.
 * Dark mode uses a lighter step of the same green, because brand700 is too dark
 * to read as a line or bar on a dark card.
 */
export const chartColors = {
    light: {
        saudi: brand[700],
        nonSaudi: '#B0862F',
        total: '#6B7A76',
        male: '#3E6E9E',
        female: '#B4566B',
        increase: '#1F6E43',
        decrease: '#A3301F',
        publicSector: '#7C5E99',
        privateSector: '#2E7D9A',
        grid: '#DCE6E1',
    },
    dark: {
        saudi: brand[500],
        nonSaudi: '#E0BE72',
        total: '#A3B5AF',
        male: '#6F9BC8',
        female: '#D9828F',
        increase: '#6FD49A',
        decrease: '#F08A7E',
        publicSector: '#B39BD0',
        privateSector: '#6CB8D4',
        grid: '#22332E',
    },
} as const satisfies Record<ResolvedMode, Record<string, string>>;

export type ChartColors = (typeof chartColors)[ResolvedMode];

/* ---------- Sizes (same in light and dark), all in px ---------- */

/** One spacing scale for margins, paddings and gaps. CSS: var(--m-space-lg) */
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
} as const;

/** CSS: var(--m-radius-md) */
export const radius = {
    sm: 6,
    md: 12,
    lg: 20,
    pill: 999,
} as const;

/** CSS: var(--m-font-sm) */
export const fontSize = {
    xs: 11,
    sm: 12,
    md: 13,
    base: 15,
    lg: 22,
    title: 30,
    kpi: 30,
} as const;

/** Page and component dimensions. CSS: var(--m-layout-max-width) */
export const layout = {
    /** Only very wide screens stop growing here; laptops use the full width. */
    maxWidth: 1600,
    headerHeight: 64,
    /** The logo in the header. */
    headerLogoSize: 40,
    /** Narrowest a KPI card gets before the grid drops a column. */
    kpiMinWidth: 240,
    /** Narrowest a chart card gets before charts stack. */
    chartMinWidth: 460,
    /** Default chart height on desktop; phones get 80% of it. */
    chartHeight: 320,
    /** Thickness of a bar in a BarList (ranked lists of categories). */
    barTrackHeight: 10,
    /** Narrowest a region tile gets before the tile grid drops a column. */
    filterMinWidth: 180,
    sparklineHeight: 36,
    /** The short woven Sadu band on the 404 page: five eyes of the band (66px each). */
    notFoundBandWidth: 330,
    /** The Sadu eye marking each step of a timeline. */
    timelineMarkerSize: 36,
    /** Narrowest an entry in a chart key (e.g. beside a donut) gets before the key drops a column. */
    keyItemMinWidth: 220,
} as const;

/** IBM Plex Sans Arabic covers Arabic and Latin, so both languages share one font. */
export const fontFamily =
    "'IBM Plex Sans Arabic', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/** Chart drawing sizes, shared by every Recharts chart. */
export const chart = {
    lineWidth: 2.5,
    /** The Sadu eye marking the hovered point on a line, and the end of a sparkline. */
    markerSize: 14,
    /** The Sadu eye in chart legends. */
    legendMarkerSize: 12,
    /** The solid Sadu diamond in color keys (donut, 100% bar). */
    keyMarkerSize: 14,
    groupedBarThickness: 28,
    barRadius: 6,
    /** Width reserved for value-axis labels. */
    valueAxisWidth: { percent: 44, currency: 60 },
    /** Minimum gap between time labels on the x axis. */
    minTickGap: { desktop: 16, mobile: 28 },
    /** Opacity at the top of an area chart's fill; it fades to 0 at the bottom. */
    areaOpacity: 0.28,
    /** Quarters shown in a KPI card's sparkline. */
    sparklinePoints: 8,
} as const;