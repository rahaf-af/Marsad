import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterField } from '../../../shared/components/filters/FilterField';
import { NATIONALITIES } from '../selectors';
import type { Nationality } from '../types';

interface NationalityFilterProps {
    value: Nationality;
    onChange: (value: Nationality) => void;
}

export function NationalityFilter({ value, onChange }: NationalityFilterProps) {
    const { t } = useTranslation();
    return (
        <FilterField label={t('filters.nationality')}>
            <Segmented<Nationality>
                value={value}
                onChange={onChange}
                options={NATIONALITIES.map((n) => ({ value: n, label: t(`nationality.${n}`) }))}
            />
        </FilterField>
    );
}