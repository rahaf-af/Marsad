import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './themeContext';
import { cssVariables } from './cssVariables';
import { withViewTransition } from '../lib/viewTransition';

const STORAGE_KEY = 'mersad-theme';

function readStoredMode(): ThemeMode {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value === 'light' || value === 'dark') return value;
    } catch {
        // Storage can be unavailable (private mode, sandboxed iframes). Fall back quietly.
    }
    // First visit (or an old "system" value): light.
    return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

    // Expose every token as a CSS variable (--m-primary, --m-space-lg, …) so CSS Modules use the
    // same values as antd, and native controls (scrollbars, inputs) follow the theme.
    // useLayoutEffect runs before the browser paints, so there's no flash of unstyled colors.
    useLayoutEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = mode;
        root.style.colorScheme = mode;
        for (const [name, value] of Object.entries(cssVariables(mode))) {
            root.style.setProperty(name, value);
        }
    }, [mode]);

    const setMode = useCallback((next: ThemeMode) => {
        // Cross-fade between light and dark instead of switching in one frame.
        withViewTransition(() => setModeState(next));
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Ignore: the choice still applies for this visit.
        }
    }, []);

    const value = useMemo(() => ({ mode, resolvedMode: mode, setMode }), [mode, setMode]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}