import { useMemo } from 'react';
import { useSearchParamState } from '../../shared/hooks/useSearchParamState';
import { GENDERS, NATIONALITIES } from './selectors';
import type { Gender, Meta, Nationality } from './types';

/** ?period=2025-Q4 — only quarters that exist in meta.json are accepted. */
export function usePeriodFilter(meta: Meta) {
    const periods = useMemo(() => meta.quarters.map((q) => q.period), [meta]);
    const [period, setPeriod] = useSearchParamState('period', periods, meta.latestPeriod);
    return { period, setPeriod, periods };
}

/** ?nationality=nonSaudi */
export function useNationalityFilter(fallback: Nationality = 'saudi') {
    return useSearchParamState('nationality', NATIONALITIES, fallback);
}

/** ?gender=female */
export function useGenderFilter(fallback: Gender = 'total') {
    return useSearchParamState('gender', GENDERS, fallback);
}