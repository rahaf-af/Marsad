import { Button } from 'antd';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../shared/i18n/useLanguage';
import styles from './LanguageSwitcher.module.css';

/** Shows the *other* language's name, written in that language: "English" / "العربية". */
export function LanguageSwitcher() {
    const { t } = useTranslation();
    const { lang, toggleLanguage } = useLanguage();
    const target = lang === 'ar' ? 'en' : 'ar';

    return (
        <Button
            type="text"
            icon={<Languages size={18} aria-hidden />}
            onClick={toggleLanguage}
            // Same words as the visible label, so it still has a name when the label is hidden on phones.
            aria-label={t('language.switchTo')}
            title={t('language.label')}
            lang={target}
        >
            <span className={styles.label}>{t('language.switchTo')}</span>
        </Button>
    );
}