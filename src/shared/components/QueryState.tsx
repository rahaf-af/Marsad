import type { ReactNode } from 'react';
import type { AsyncResult } from '../lib/queryStatus';
import { DataUnavailable } from './DataUnavailable';
import { ErrorAlert } from './ErrorAlert';
import { PageLoader } from './PageLoader';

interface QueryStateProps<T> {
    query: AsyncResult<T>;
    /** Rendered only once the data is there, so `data` is never undefined inside. */
    children: (data: T) => ReactNode;
    /** Replace the default page loader, e.g. with a skeleton. */
    loader?: ReactNode;
    isEmpty?: (data: T) => boolean;
}

/**
 * Handles loading, error and empty states for any query:
 *
 *   <QueryState query={useTimeseries()}>
 *     {(series) => <UnemploymentChart data={series} />}
 *   </QueryState>
 */
export function QueryState<T>({ query, children, loader, isEmpty }: QueryStateProps<T>) {
    if (query.isPending) return <>{loader ?? <PageLoader />}</>;
    if (query.isError || query.data === undefined) {
        return <ErrorAlert error={query.error} onRetry={() => void query.refetch()} />;
    }
    if (isEmpty?.(query.data)) return <DataUnavailable />;
    return <>{children(query.data)}</>;
}