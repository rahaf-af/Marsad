import { Card } from 'antd';
import type { ReactNode } from 'react';
import { SaduBand } from '../../shared/components/SaduBand';
import styles from './ValueCard.module.css';

interface ValueCardProps {
    icon: ReactNode;
    title: string;
    body: string;
}

/** One of the vision / mission / goals cards on the About page, topped with a Sadu band. */
export function ValueCard({ icon, title, body }: ValueCardProps) {
    return (
        <Card variant="outlined" className={styles.card} cover={<SaduBand className={styles.band} />}>
            <span className={styles.icon} aria-hidden>
                {icon}
            </span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.body}>{body}</p>
        </Card>
    );
}