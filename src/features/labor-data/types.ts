import type { LocalizedText } from '../../shared/i18n/languages';

/** Shapes of the JSON files in public/data, as written by scripts/convert_labor_data.py. */

export type Nationality = 'saudi' | 'nonSaudi' | 'total';
export type Gender = 'male' | 'female' | 'total';

/** null means GASTAT didn't publish that value. Never treat it as 0. */
export type Value = number | null;

export type Breakdown = Record<Nationality, Record<Gender, Value>>;

export type TimeseriesIndicator =
    | 'unemployment_rate'
    | 'employment_to_population_ratio'
    | 'labor_force_participation_rate'
    | 'public_sector_share'
    | 'private_sector_share';

export interface TimeseriesPoint {
    period: string; // "2026-Q2"
    year: number;
    quarter: number;
    values: Record<TimeseriesIndicator, Breakdown>;
}

export type QuarterTableKey =
    | 'unemployment_by_age'
    | 'unemployment_by_region'
    | 'participation_by_region'
    | 'employed_by_education'
    | 'employed_by_occupation'
    | 'employed_by_activity'
    | 'employed_by_sector'
    | 'wage_by_age'
    | 'wage_by_activity_group';

export interface CategoryRow {
    id: string; // e.g. "riyadh", matches a key in meta.categories
    values: Breakdown;
}

export interface CategoryTable {
    categories: CategoryRow[];
    total: Breakdown | null;
}

export interface QuarterData {
    period: string;
    year: number;
    quarter: number;
    /** A table is null when GASTAT didn't publish it that quarter. */
    data: Record<QuarterTableKey, CategoryTable | null>;
}

export type CategoryGroup =
    | 'region'
    | 'age'
    | 'education'
    | 'occupation'
    | 'activity'
    | 'sector'
    | 'wageActivityGroup';

export interface QuarterInfo {
    period: string;
    year: number;
    quarter: number;
    missingTables: QuarterTableKey[];
}

export interface Meta {
    source: LocalizedText & { url: string };
    latestPeriod: string;
    quarters: QuarterInfo[];
    timeseriesRange: [string, string];
    methodologyNotes: string[];
    indicators: Record<TimeseriesIndicator | QuarterTableKey, LocalizedText & { unit: 'percent' | 'SAR' }>;
    nationality: Record<Nationality, LocalizedText>;
    gender: Record<Gender, LocalizedText>;
    categories: Record<CategoryGroup, Record<string, LocalizedText>>;
}