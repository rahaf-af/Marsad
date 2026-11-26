import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SaduLoader } from './sadu/SaduLoader';
import styles from './PageLoader.module.css';

const SHOW_AFTER_MS = 200;

/**
 * Centered loader for a page or a large section.
 * It waits 200 ms before appearing, so cached data doesn't cause a loader flash.
 */
export function PageLoader({ label }: { label?: string }) {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.loader} role="status" aria-live="polite">
            {visible && (
                <>
                    <SaduLoader />
                    <Typography.Text type="secondary">{label ?? t('common.loadingData')}</Typography.Text>
                </>
            )}
        </div>
    );
}