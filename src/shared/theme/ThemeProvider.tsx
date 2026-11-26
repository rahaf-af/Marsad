import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './themeContext';
import { cssVariables } from './cssVariables';
import type { ResolvedMode } from './tokens';
import { withViewTransition } from '../lib/viewTransition';

const STORAGE_KEY = 'mersad-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readStoredMode(): ThemeMode {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value === 'light' || value === 'dark' || value === 'system') return value;
    } catch {
        // Storage can be unavailable (private mode, sandboxed iframes). Fall back quietly.
    }
    return 'light';
}

function systemPrefersDark(): boolean {
    return typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
    const [systemDark, setSystemDark] = useState(systemPrefersDark);

    // Follow OS changes while the user is on "system".
    useEffect(() => {
        const media = window.matchMedia(DARK_QUERY);
        const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const resolvedMode: ResolvedMode =
        mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

    // Expose every token as a CSS variable (--m-primary, --m-space-lg, …) so CSS Modules use the
    // same values as antd, and native controls (scrollbars, inputs) follow the theme.
    // useLayoutEffect runs before the browser paints, so there's no flash of unstyled colors.
    useLayoutEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = resolvedMode;
        root.style.colorScheme = resolvedMode;
        for (const [name, value] of Object.entries(cssVariables(resolvedMode))) {
            root.style.setProperty(name, value);
        }
    }, [resolvedMode]);

    const setMode = useCallback((next: ThemeMode) => {
        // Cross-fade between light and dark instead of switching in one frame.
        withViewTransition(() => setModeState(next));
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Ignore: the choice still applies for this visit.
        }
    }, []);

    const value = useMemo(
        () => ({ mode, resolvedMode, setMode }),
        [mode, resolvedMode, setMode],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}