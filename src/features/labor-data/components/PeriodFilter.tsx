import { useTranslation } from 'react-i18next';
import { FilterField } from '../../../shared/components/filters/FilterField';
import { PeriodSelect } from '../../../shared/components/filters/PeriodSelect';

interface PeriodFilterProps {
    periods: readonly string[];
    value: string;
    onChange: (period: string) => void;
}

export function PeriodFilter({ periods, value, onChange }: PeriodFilterProps) {
    const { t } = useTranslation();
    return (
        <FilterField label={t('filters.period')}>
            <PeriodSelect periods={periods} value={value} onChange={onChange} ariaLabel={t('filters.period')} />
        </FilterField>
    );
}