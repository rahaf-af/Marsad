import { skipToken, useQuery } from '@tanstack/react-query';
import { laborApi } from './api';
import { laborKeys } from './queryKeys';

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

/** Detailed tables for one quarter. Waits until a period is known. */
export function useQuarter(period: string | undefined) {
    return useQuery({
        queryKey: laborKeys.quarter(period ?? 'none'),
        queryFn: period ? ({ signal }) => laborApi.quarter(period, signal) : skipToken,
    });
}