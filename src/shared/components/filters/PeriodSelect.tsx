import { Select } from 'antd';
import { useMemo } from 'react';
import { useLanguage } from '../../i18n/useLanguage';
import { usePeriodLabel } from '../../i18n/usePeriodLabel';
import { formatYear, parsePeriod } from '../../lib/format';
import styles from './PeriodSelect.module.css';

interface PeriodSelectProps {
    /** Available periods like "2026-Q2", in any order. */
    periods: readonly string[];
    value: string;
    onChange: (period: string) => void;
    ariaLabel: string;
}

/** Quarter picker grouped by year, newest first. */
export function PeriodSelect({ periods, value, onChange, ariaLabel }: PeriodSelectProps) {
    const { lang } = useLanguage();
    const periodLabel = usePeriodLabel();

    const options = useMemo(() => {
        const byYear = new Map<number, string[]>();
        for (const period of periods) {
            const { year } = parsePeriod(period);
            byYear.set(year, [...(byYear.get(year) ?? []), period]);
        }
        return [...byYear.entries()]
            .sort(([a], [b]) => b - a)
            .map(([year, list]) => ({
                label: formatYear(year, lang),
                title: String(year),
                options: [...list].sort().reverse().map((period) => ({ value: period, label: periodLabel(period) })),
            }));
    }, [periods, lang, periodLabel]);

    return (
        <Select
            value={value}
            onChange={onChange}
            options={options}
            aria-label={ariaLabel}
            className={styles.select}
            popupMatchSelectWidth={false}
        />
    );
}