import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { FilterField } from '../../../shared/components/filters/FilterField';
import { GENDERS } from '../selectors';
import type { Gender } from '../types';

interface GenderFilterProps {
    value: Gender;
    onChange: (value: Gender) => void;
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
    const { t } = useTranslation();
    return (
        <FilterField label={t('filters.gender')}>
            <Segmented<Gender>
                value={value}
                onChange={onChange}
                options={GENDERS.map((g) => ({ value: g, label: t(`gender.${g}`) }))}
            />
        </FilterField>
    );
}