import { Button, Card, Slider } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../i18n/useLanguage';
import { usePeriodLabel } from '../../i18n/usePeriodLabel';
import { formatYear, parsePeriod } from '../../lib/format';
import styles from './PeriodTimeline.module.css';

const ICON_SIZE = 18;

interface PeriodTimelineProps {
    /** Available periods like "2026-Q2", in any order. */
    periods: readonly string[];
    value: string;
    onChange: (period: string) => void;
}

/**
 * Pick a quarter by sliding along time. Every move updates the page in place,
 * so you can watch the numbers change from one quarter to the next.
 * The arrow buttons step one quarter at a time, which is easier on a phone.
 */
export function PeriodTimeline({ periods, value, onChange }: PeriodTimelineProps) {
    const { t } = useTranslation();
    const { lang, dir } = useLanguage();
    const periodLabel = usePeriodLabel();

    const sorted = useMemo(() => [...periods].sort(), [periods]);
    const index = Math.max(0, sorted.indexOf(value));
    const last = sorted.length - 1;

    // One mark per year, on its first quarter.
    const marks = useMemo(
        () =>
            Object.fromEntries(
                sorted.flatMap((period, i) => {
                    const { year, quarter } = parsePeriod(period);
                    return quarter === 1 || i === 0 ? [[i, formatYear(year, lang)] as [number, string]] : [];
                }),
            ),
        [sorted, lang],
    );

    const goTo = (i: number) => onChange(sorted[Math.min(last, Math.max(0, i))]);

    // "Older" points back in the reading direction: right in Arabic, left in English.
    const OlderIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
    const NewerIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

    return (
        <Card variant="outlined" className={styles.card}>
            <div className={styles.row}>
                <div className={styles.current}>
                    <span className={styles.label}>{t('filters.period')}</span>
                    <span className={styles.value} aria-live="polite">
                        {periodLabel(sorted[index])}
                    </span>
                </div>

                <div className={styles.control}>
                    <Button
                        shape="circle"
                        icon={<OlderIcon size={ICON_SIZE} />}
                        onClick={() => goTo(index - 1)}
                        disabled={index === 0}
                        aria-label={t('timeline.previous')}
                    />
                    <div className={styles.slider}>
                        <Slider
                            min={0}
                            max={last}
                            step={1}
                            value={index}
                            marks={marks}
                            onChange={goTo}
                            tooltip={{ formatter: (i) => (i == null ? '' : periodLabel(sorted[i])) }}
                            ariaLabelForHandle={t('filters.period')}
                            ariaValueTextFormatterForHandle={(i) => (i == null ? '' : periodLabel(sorted[i]))}
                        />
                    </div>
                    <Button
                        shape="circle"
                        icon={<NewerIcon size={ICON_SIZE} />}
                        onClick={() => goTo(index + 1)}
                        disabled={index === last}
                        aria-label={t('timeline.next')}
                    />
                </div>
            </div>
        </Card>
    );
}