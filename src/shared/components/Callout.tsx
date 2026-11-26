import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './Callout.module.css';

/** A soft, friendly note in the brand color, for context the reader should know. */
export function Callout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.callout} role="note">
            <Info size={18} className={styles.icon} aria-hidden />
            <p className={styles.text}>{children}</p>
        </div>
    );
}