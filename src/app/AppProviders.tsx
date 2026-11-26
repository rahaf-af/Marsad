import { useMemo, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import { useLanguage } from '../shared/i18n/useLanguage';
import { getAntdTheme } from '../shared/theme/antdTheme';
import { ThemeProvider } from '../shared/theme/ThemeProvider';
import { useThemeMode } from '../shared/theme/useTheme';
import { queryClient } from './queryClient';

/** Connects our theme mode and language to Ant Design (colors, direction, built-in texts). */
function AntdConfig({ children }: { children: ReactNode }) {
    const { resolvedMode } = useThemeMode();
    const { lang, dir } = useLanguage();
    const themeConfig = useMemo(() => getAntdTheme(resolvedMode), [resolvedMode]);

    return (
        <ConfigProvider theme={themeConfig} direction={dir} locale={lang === 'ar' ? arEG : enUS}>
            {/* antd's <App> gives message/notification/modal access to the theme above. */}
            <AntdApp>{children}</AntdApp>
        </ConfigProvider>
    );
}

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AntdConfig>{children}</AntdConfig>
            </ThemeProvider>
        </QueryClientProvider>
    );
}