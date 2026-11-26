import { useTranslation } from 'react-i18next';
import { Callout } from '../../../shared/components/Callout';

/** GASTAT changed how it collects the survey several times since 2021; say so next to trends. */
export function MethodologyNote() {
    const { t } = useTranslation();
    return <Callout>{t('common.methodologyNote')}</Callout>;
}