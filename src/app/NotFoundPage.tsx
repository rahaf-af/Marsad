import { Button } from 'antd';
import { House } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SaduWeave } from '../shared/components/sadu/SaduWeave';
import { useLanguage } from '../shared/i18n/useLanguage';
import { formatNumber } from '../shared/lib/format';
import styles from './NotFoundPage.module.css';

/**
 * Shown for any URL that isn't a page. Plain and calm, with a single short piece of the
 * woven Sadu band from the About page as its one touch of the identity.
 */
export function NotFoundPage() {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const navigate = useNavigate();

    return (
        <section className={styles.page} aria-labelledby="not-found-title">
            <div className={styles.band}>
                <SaduWeave />
            </div>
            <p className={styles.code}>{formatNumber(404, lang)}</p>
            <h1 id="not-found-title" className={styles.title}>
                {t('notFound.title')}
            </h1>
            <p className={styles.body}>{t('notFound.body')}</p>
            <Button type="primary" size="large" icon={<House size={16} aria-hidden />} onClick={() => navigate('/')}>
                {t('notFound.home')}
            </Button>
        </section>
    );
}