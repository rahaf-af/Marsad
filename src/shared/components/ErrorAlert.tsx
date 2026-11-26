import { Alert, Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HttpError } from '../lib/http';
import { CircleAlert } from 'lucide-react';

interface ErrorAlertProps {
    error: unknown;
    /** Shows a "Try again" button when provided. */
    onRetry?: () => void;
}

/** The one way errors look across Mersad: a clear title, what happened, and a retry. */
export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
    const { t } = useTranslation();
    const kind = error instanceof HttpError ? error.kind : 'unknown';

    // Keep the technical details in the console for us, not on screen for the user.
    useEffect(() => {
        if (import.meta.env.DEV) console.error(error);
    }, [error]);

    return (
        <Alert
            type="error"
            showIcon
            icon={<CircleAlert size={18} aria-hidden />}
            title={t('errors.title')}
            description={t(`errors.${kind}`)}
            action={
                onRetry && (
                    <Button size="small" danger onClick={onRetry}>
                        {t('common.retry')}
                    </Button>
                )
            }
        />
    );
}