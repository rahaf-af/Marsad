/** All cache keys in one place, so invalidating or prefetching never guesses a key. */
export const laborKeys = {
    all: ['labor'] as const,
    meta: () => [...laborKeys.all, 'meta'] as const,
    timeseries: () => [...laborKeys.all, 'timeseries'] as const,
    quarter: (period: string) => [...laborKeys.all, 'quarter', period] as const,
};