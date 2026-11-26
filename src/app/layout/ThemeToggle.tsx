import { Segmented } from 'antd';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../../shared/theme/themeContext';
import { useThemeMode } from '../../shared/theme/useTheme';
import styles from './ThemeToggle.module.css';

const ICON_SIZE = 16;

export function ThemeToggle() {
    const { t } = useTranslation();
    const { mode, setMode } = useThemeMode();

    return (
        <div role="group" aria-label={t('theme.label')}>
            <Segmented<ThemeMode>
                size="small"
                value={mode}
                onChange={setMode}
                options={[
                    { value: 'light', icon: <Sun size={ICON_SIZE} className={styles.icon} />, title: t('theme.light') },
                    { value: 'dark', icon: <Moon size={ICON_SIZE} className={styles.icon} />, title: t('theme.dark') },
                ]}
            />
        </div>
    );
}