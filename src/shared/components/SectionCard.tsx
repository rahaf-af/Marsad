import { Card } from 'antd';
import type { ReactNode } from 'react';
import styles from './SectionCard.module.css';

interface SectionCardProps {
    title: string;
    /** One line under the title, e.g. "Data for Q2 2026". */
    description?: string;
    /** Controls on the opposite side of the title. They wrap below on narrow screens. */
    extra?: ReactNode;
    children: ReactNode;
}

/**
 * The card every section uses: title, a short description and the content,
 * with no divider in between. Charts, tables and text cards all look the same.
 */
export function SectionCard({ title, description, extra, children }: SectionCardProps) {
    return (
        <Card variant="outlined" className={styles.card}>
            <div className={styles.heading}>
                <div className={styles.titles}>
                    <h2 className={styles.title}>{title}</h2>
                    {description && <p className={styles.description}>{description}</p>}
                </div>
                {extra}
            </div>
            {children}
        </Card>
    );
}