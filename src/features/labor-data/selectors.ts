import type { LocalizedText } from '../../shared/i18n/languages';
import type {
    Breakdown,
    CategoryTable,
    Gender,
    Nationality,
    TimeseriesIndicator,
    TimeseriesPoint,
    Value,
} from './types';

/**
 * Pure functions that shape the JSON into what charts need.
 * No React here, so they're easy to test and reuse in any feature.
 */

export const NATIONALITIES = ['saudi', 'nonSaudi', 'total'] as const satisfies readonly Nationality[];
export const GENDERS = ['male', 'female', 'total'] as const satisfies readonly Gender[];

/** One number out of a nationality × gender breakdown. */
export function pick(breakdown: Breakdown | null | undefined, nationality: Nationality, gender: Gender): Value {
    return breakdown?.[nationality]?.[gender] ?? null;
}

/** Difference between two values, or null if either is missing. */
export function difference(current: Value, previous: Value): number | null {
    if (current == null || previous == null) return null;
    return Math.round((current - previous) * 100) / 100;
}

/** The point for a period and the one before it, for "vs last quarter" comparisons. */
export function pointWithPrevious(series: readonly TimeseriesPoint[], period: string) {
    const index = series.findIndex((point) => point.period === period);
    return {
        current: index >= 0 ? series[index] : undefined,
        previous: index > 0 ? series[index - 1] : undefined,
    };
}

/** KPI helper: value for a period plus its change from the previous quarter. */
export function indicatorWithChange(
    series: readonly TimeseriesPoint[],
    period: string,
    indicator: TimeseriesIndicator,
    nationality: Nationality,
    gender: Gender,
) {
    const { current, previous } = pointWithPrevious(series, period);
    const value = pick(current?.values[indicator], nationality, gender);
    const before = pick(previous?.values[indicator], nationality, gender);
    return { value, change: difference(value, before), previousPeriod: previous?.period };
}

export interface TrendSeriesSpec {
    key: string;
    indicator: TimeseriesIndicator;
    nationality: Nationality;
    gender: Gender;
}

/** Rows for a TrendLineChart: [{ period: "2021-Q1", saudi: 11.7, nonSaudi: 2.3 }, …] */
export function trendRows(series: readonly TimeseriesPoint[], specs: readonly TrendSeriesSpec[]) {
    return series.map((point) => {
        const row: Record<string, string | number | null> = { period: point.period };
        for (const spec of specs) {
            row[spec.key] = pick(point.values[spec.indicator], spec.nationality, spec.gender);
        }
        return row;
    });
}

/**
 * GASTAT's "Not stated" rows are survey answers without a category. They're left out of
 * charts so they don't read as a real occupation, region or activity.
 */
const NOT_STATED = 'not_stated';
const shownRows = (table: CategoryTable) => table.categories.filter((row) => row.id !== NOT_STATED);

/** Rows for a RankedBarChart from one quarter table, with labels in the active language. */
export function categoryRows(
    table: CategoryTable | null | undefined,
    labels: Record<string, LocalizedText>,
    localize: (text: LocalizedText) => string,
    nationality: Nationality,
    gender: Gender,
) {
    if (!table) return [];
    return shownRows(table).map((row) => ({
        id: row.id,
        label: labels[row.id] ? localize(labels[row.id]) : row.id,
        value: pick(row.values, nationality, gender),
    }));
}

/** Rows for a GroupedBarChart: one row per category, one field per series. */
export function groupedCategoryRows(
    table: CategoryTable | null | undefined,
    labels: Record<string, LocalizedText>,
    localize: (text: LocalizedText) => string,
    specs: readonly { key: string; nationality: Nationality; gender: Gender }[],
) {
    if (!table) return [];
    return shownRows(table).map((row) => {
        const out: Record<string, string | number | null> = {
            id: row.id,
            label: labels[row.id] ? localize(labels[row.id]) : row.id,
        };
        for (const spec of specs) out[spec.key] = pick(row.values, spec.nationality, spec.gender);
        return out;
    });
}

/** True when a table has nothing to draw for the chosen group. */
export function isTableEmpty(table: CategoryTable | null | undefined, nationality: Nationality, gender: Gender) {
    return !table || shownRows(table).every((row) => pick(row.values, nationality, gender) == null);
}

/** The last `count` values up to and including `endPeriod`, oldest first (for sparklines). */
export function recentValues(
    series: readonly TimeseriesPoint[],
    endPeriod: string,
    indicator: TimeseriesIndicator,
    nationality: Nationality,
    gender: Gender,
    count: number,
): Value[] {
    const end = series.findIndex((point) => point.period === endPeriod);
    if (end < 0) return [];
    return series
        .slice(Math.max(0, end - count + 1), end + 1)
        .map((point) => pick(point.values[indicator], nationality, gender));
}