import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

/** For values GASTAT didn't publish (null in the JSON), so a gap never looks like a zero. */
export function DataUnavailable({ message }: { message?: string }) {
    const { t } = useTranslation();
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={message ?? t('common.notAvailable')} />;
}