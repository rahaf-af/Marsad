import { keepPreviousData, skipToken, useQueries, useQuery } from '@tanstack/react-query';
import { laborApi } from './api';
import { laborKeys } from './queryKeys';
import type { QuarterData } from './types';

/** Labels, available quarters and the source. Almost every page needs it. */
export function useMeta() {
    return useQuery({
        queryKey: laborKeys.meta(),
        queryFn: ({ signal }) => laborApi.meta(signal),
    });
}

/** Headline rates for every quarter since 2021, for trend charts and KPI cards. */
export function useTimeseries() {
    return useQuery({
        queryKey: laborKeys.timeseries(),
        queryFn: ({ signal }) => laborApi.timeseries(signal),
    });
}

/**
 * Detailed tables for one quarter. Waits until a period is known.
 * While the next quarter loads, the previous one stays on screen, so moving between
 * quarters changes the numbers in place instead of flashing loading skeletons.
 */
export function useQuarter(period: string | undefined) {
    return useQuery({
        queryKey: laborKeys.quarter(period ?? 'none'),
        queryFn: period ? ({ signal }) => laborApi.quarter(period, signal) : skipToken,
        placeholderData: keepPreviousData,
    });
}

/**
 * Detailed tables for several quarters at once, keyed by period ("2026-Q2").
 * Shares the cache with useQuarter, so a quarter is never downloaded twice.
 * A quarter that is still loading is undefined.
 */
export function useQuarters(periods: readonly string[]) {
    return useQueries({
        queries: periods.map((period) => ({
            queryKey: laborKeys.quarter(period),
            queryFn: ({ signal }: { signal: AbortSignal }) => laborApi.quarter(period, signal),
        })),
        combine: (results) =>
            Object.fromEntries(periods.map((period, i) => [period, results[i]?.data])) as Record<
                string,
                QuarterData | undefined
            >,
    });
}