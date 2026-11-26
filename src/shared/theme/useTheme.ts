import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from './themeContext';
import { chartColors, type ChartColors } from './tokens';

export function useThemeMode(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeMode must be used inside <ThemeProvider>');
    return context;
}

/** Chart colors for the current mode, for Recharts fills and strokes. */
export function useChartColors(): ChartColors {
    return chartColors[useThemeMode().resolvedMode];
}