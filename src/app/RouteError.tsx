import { useRouteError } from 'react-router-dom';
import { ErrorAlert } from '../shared/components/ErrorAlert';

/**
 * Shown when a page crashes while rendering. The header and menu stay usable,
 * so one broken page never takes the whole dashboard down.
 */
export function RouteError() {
    const error = useRouteError();
    return <ErrorAlert error={error} onRetry={() => window.location.reload()} />;
}