import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useLanguage } from '../../i18n/useLanguage';
import { media } from '../../theme/breakpoints';
import { chart, fontSize, spacing } from '../../theme/tokens';

/**
 * Settings every chart shares, so all charts behave the same in RTL, on phones and for reduced motion.
 *
 * About RTL: Recharts lays out its SVG for left-to-right, and a page-level dir="rtl" flips what
 * SVG text-anchor means, which pushes labels into the bars. So every chart's SVG is drawn with
 * dir="ltr" (see `svgDir`) and mirrored by hand with `isRtl` (reversed x axis, value axis on the
 * right). Arabic text inside still reads right-to-left on its own.
 */
export function useChartSettings() {
    const { lang, dir } = useLanguage();
    const isMobile = useMediaQuery(media.mobile);
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    return {
        lang,
        isRtl: dir === 'rtl',
        /** The page direction, for HTML inside charts such as tooltips. */
        dir,
        svgDir: 'ltr' as const,
        isMobile,
        animate: !reducedMotion,
        tick: { fill: 'var(--m-text-secondary)', fontSize: isMobile ? fontSize.xs : fontSize.sm },
        gridStroke: 'var(--m-chart-grid)',
        axisStroke: 'var(--m-border)',
        cursorFill: 'var(--m-primary-soft)',
        margin: { top: spacing.sm, right: spacing.sm, bottom: 0, left: spacing.sm },
        tickMargin: spacing.sm,
        minTickGap: isMobile ? chart.minTickGap.mobile : chart.minTickGap.desktop,
    };
}