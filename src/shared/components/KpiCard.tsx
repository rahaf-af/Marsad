import { Card } from 'antd';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/useLanguage';
import { formatChange, formatCurrency, formatNumber, formatPercent } from '../lib/format';
import { Sparkline } from './charts/Sparkline';
import styles from './KpiCard.module.css';

export type KpiFormat = 'percent' | 'currency' | 'number';

interface KpiCardProps {
    title: string;
    value: number | null | undefined;
    /** A Lucide icon shown in a brand-colored chip, e.g. <Users />. */
    icon?: ReactNode;
    format?: KpiFormat;
    /** Difference from the previous period, in the same unit as value. */
    change?: number | null;
    /** e.g. "vs Q1 2026". */
    comparisonLabel?: string;
    /** Unemployment going up is bad news, so pass false for it. */
    positiveIsGood?: boolean;
    /** Recent values, oldest first, drawn as a small trend line. */
    trend?: readonly (number | null)[];
    /** Link to the detail page. */
    to?: string;
    loading?: boolean;
}

const ARROW_SIZE = 14;

export function KpiCard({
    title,
    value,
    icon,
    format = 'percent',
    change,
    comparisonLabel,
    positiveIsGood = true,
    trend,
    to,
    loading = false,
}: KpiCardProps) {
    const { t } = useTranslation();
    const { lang, dir } = useLanguage();

    const formatted =
        format === 'percent'
            ? formatPercent(value, lang)
            : format === 'currency'
                ? formatCurrency(value, lang)
                : formatNumber(value, lang);

    let tone = styles.neutral;
    if (change != null && change !== 0) {
        const improved = positiveIsGood ? change > 0 : change < 0;
        tone = improved ? styles.good : styles.bad;
    }
    const unit = format === 'percent' ? ` ${t('common.percentagePoints')}` : '';
    const ForwardArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
        <Card variant="outlined" loading={loading} className={styles.card}>
            <div className={styles.top}>
                <div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.value}>{formatted}</div>
                </div>
                {icon && (
                    <span className={styles.icon} aria-hidden>
                        {icon}
                    </span>
                )}
            </div>

            {trend && <Sparkline values={trend} />}

            {(change != null || comparisonLabel) && (
                <div className={styles.changeRow}>
                    {change != null && (
                        <span className={`${styles.change} ${tone}`}>
                            {change > 0 && <ArrowUp size={ARROW_SIZE} aria-hidden />}
                            {change < 0 && <ArrowDown size={ARROW_SIZE} aria-hidden />}
                            {formatChange(change, lang, format === 'percent' ? 1 : 0)}
                            {unit}
                        </span>
                    )}
                    {comparisonLabel && <span className={styles.comparison}>{comparisonLabel}</span>}
                </div>
            )}

            {to && (
                <div className={styles.footer}>
                    <Link to={to} className={styles.link}>
                        {t('common.details')}
                        <ForwardArrow size={ARROW_SIZE} aria-hidden />
                    </Link>
                </div>
            )}
        </Card>
    );
}