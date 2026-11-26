import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A filter value stored in the URL (?nationality=saudi), so a filtered view can be
 * bookmarked or shared. Unknown values in the URL fall back safely.
 * The fallback is left out of the URL to keep links short.
 */
export function useSearchParamState<T extends string>(
    key: string,
    allowed: readonly T[],
    fallback: T,
): [T, (next: T) => void] {
    const [params, setParams] = useSearchParams();
    const raw = params.get(key);
    const value = raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;

    const setValue = useCallback(
        (next: T) => {
            setParams(
                (prev) => {
                    const updated = new URLSearchParams(prev);
                    if (next === fallback) updated.delete(key);
                    else updated.set(key, next);
                    return updated;
                },
                { replace: true }, // filters shouldn't fill the back button history
            );
        },
        [key, fallback, setParams],
    );

    return [value, setValue];
}