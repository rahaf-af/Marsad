import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../shared/i18n/languages';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { formatNumber, formatYear, parsePeriod } from '../../shared/lib/format';
import type { Meta } from '../labor-data/types';
import styles from './AboutStats.module.css';

/** Mersad in four numbers, shown inside the green hero of the About page. */
export function AboutStats({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const [from, to] = meta.timeseriesRange;
    const regions = Object.keys(meta.categories.region).length;

    const stats = [
        { value: formatNumber(meta.quarters.length, lang), label: t('about.stats.quarters') },
        { value: formatNumber(regions, lang), label: t('about.stats.regions') },
        {
            value: `${formatYear(parsePeriod(from).year, lang)}–${formatYear(parsePeriod(to).year, lang)}`,
            label: t('about.stats.years'),
        },
        { value: formatNumber(LANGUAGES.length, lang), label: t('about.stats.languages') },
    ];

    return (
        <dl className={styles.stats}>
            {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                    <dt className={styles.label}>{stat.label}</dt>
                    <dd className={styles.value}>{stat.value}</dd>
                </div>
            ))}
        </dl>
    );
}