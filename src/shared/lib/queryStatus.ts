export type LoadStatus = 'loading' | 'error' | 'empty' | 'ready';

/**
 * The parts of a TanStack query our UI needs. Any useQuery() result fits this shape,
 * so shared components don't depend on a specific query.
 */
export interface AsyncResult<T> {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    data: T | undefined;
    refetch: () => unknown;
}

/** Turns a query into one of four states, e.g. for <ChartCard status={...}>. */
export function toLoadStatus<T>(query: AsyncResult<T>, isEmpty?: (data: T) => boolean): LoadStatus {
    if (query.isPending) return 'loading';
    if (query.isError || query.data === undefined) return 'error';
    if (isEmpty?.(query.data)) return 'empty';
    return 'ready';
}