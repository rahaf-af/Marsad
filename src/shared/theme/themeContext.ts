import { createContext } from 'react';
import type { ResolvedMode } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {

    mode: ThemeMode;
    /** What is actually on screen. */
    resolvedMode: ResolvedMode;
    setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);