import { useCallback, useSyncExternalStore } from 'react';
import { media } from '../theme/breakpoints';

/**
 * Live result of a CSS media query. useSyncExternalStore reads the real value on the
 * first render, so there's no flash of the desktop layout on a phone.
 * Prefer CSS media queries for layout; use this only when JS must change (e.g. chart ticks).
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query);
            list.addEventListener('change', onChange);
            return () => list.removeEventListener('change', onChange);
        },
        [query],
    );
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
    );
}

export const useIsMobile = () => useMediaQuery(media.mobile);
export const useIsDesktop = () => useMediaQuery(media.desktop);