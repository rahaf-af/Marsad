/**
 * Same breakpoints as Ant Design's grid, so our CSS and antd components switch together.
 * CSS can't import these, so the media queries in .module.css files repeat the numbers:
 *   mobile  < 576px
 *   tablet  576px – 991px
 *   desktop ≥ 992px
 */
export const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
} as const;

export const media = {
    mobile: `(max-width: ${breakpoints.sm - 1}px)`,
    belowDesktop: `(max-width: ${breakpoints.lg - 1}px)`,
    desktop: `(min-width: ${breakpoints.lg}px)`,
} as const;