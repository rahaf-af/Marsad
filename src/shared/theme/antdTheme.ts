import { theme, type ThemeConfig } from 'antd';
import { fontFamily, fontSize, layout, palette, radius, spacing, type ResolvedMode } from './tokens';

/**
 * Builds the Ant Design theme for a mode, entirely from our tokens. antd derives hover,
 * active and border shades from these seeds, so changing a token re-themes antd too.
 */
export function getAntdTheme(mode: ResolvedMode): ThemeConfig {
    const c = palette[mode];

    return {
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: c.primary,
            colorInfo: c.primary,
            colorSuccess: c.success,
            colorError: c.error,
            colorWarning: c.gold,
            colorLink: c.primaryText,
            colorBgLayout: c.background,
            colorBgContainer: c.surface,
            colorBorderSecondary: c.border,
            colorText: c.text,
            colorTextSecondary: c.textSecondary,
            fontFamily,
            fontSize: fontSize.base,
            borderRadius: radius.md,
            borderRadiusLG: radius.lg,
        },
        components: {
            Layout: {
                headerBg: c.headerBg,
                headerHeight: layout.headerHeight,
                headerPadding: `0 ${spacing.xl}px`,
                bodyBg: c.background,
                footerBg: c.background,
            },
            Menu: {
                itemBg: 'transparent',
                itemSelectedColor: c.primaryText,
                itemSelectedBg: c.primarySoft,
            },
        },
    };
}

/**
 * For anything that sits on brand green (the header and each page's hero band), in light
 * and dark mode alike: a dark theme seeded with the green, so menus, buttons, switches and
 * selects turn light-on-green automatically. `inherit: false` keeps the page theme out.
 */
export function getOnBrandTheme(mode: ResolvedMode): ThemeConfig {
    const c = palette[mode];

    return {
        inherit: false,
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: c.headerAccent,
            // Links on green (the logo, hero links) hover in the brand's light green, never antd's blue.
            colorLink: c.headerText,
            colorLinkHover: c.headerAccent,
            colorLinkActive: c.headerAccent,
            colorBgBase: c.headerBg,
            colorTextBase: c.headerText,
            fontFamily,
            fontSize: fontSize.base,
            borderRadius: radius.md,
        },
        components: {
            Layout: {
                headerBg: c.headerBg,
                headerHeight: layout.headerHeight,
                headerPadding: `0 ${spacing.xl}px`,
            },
            Menu: {
                itemBg: 'transparent',
                itemPaddingInline: spacing.md,
                horizontalItemSelectedColor: c.headerText,
                horizontalItemHoverColor: c.headerText,
            },
        },
    };
}