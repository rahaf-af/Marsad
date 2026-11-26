import { createContext } from 'react';
import type { ResolvedMode } from './tokens';

export type ThemeMode = ResolvedMode;

export interface ThemeContextValue {
    /** What the user picked. */
    mode: ThemeMode;
    /** What is actually on screen (same as mode now that "system" is gone). */
    resolvedMode: ResolvedMode;
    setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);