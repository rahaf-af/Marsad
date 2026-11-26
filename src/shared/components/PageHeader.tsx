import { ConfigProvider } from 'antd';
import { useMemo, type ReactNode } from 'react';
import { getOnBrandTheme } from '../theme/antdTheme';
import { useThemeMode } from '../theme/useTheme';
import { SaduPattern } from './SaduPattern';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    description?: string;
    /** Usually the page filters. Moves under the title on narrow screens. */
    extra?: ReactNode;
}

/**
 * The green band at the top of every page. The filters inside it use the on-brand theme,
 * the same one as the header, so they read clearly on green in both modes.
 */
export function PageHeader({ title, description, extra }: PageHeaderProps) {
    const { resolvedMode } = useThemeMode();
    const onBrandTheme = useMemo(() => getOnBrandTheme(resolvedMode), [resolvedMode]);

    return (
        <header className={styles.header}>
            <SaduPattern />
            <div className={styles.text}>
                <h1 className={styles.title}>{title}</h1>
                {description && <p className={styles.description}>{description}</p>}
            </div>
            {extra && (
                <ConfigProvider theme={onBrandTheme}>
                    <div className={styles.extra}>{extra}</div>
                </ConfigProvider>
            )}
        </header>
    );
}