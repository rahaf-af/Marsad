import { useId, type ReactNode } from 'react';
import styles from './FilterField.module.css';

/** A labelled filter. The label names the group for screen readers too. */
export function FilterField({ label, children }: { label: string; children: ReactNode }) {
    const id = useId();
    return (
        <div className={styles.field} role="group" aria-labelledby={id}>
            <span id={id} className={styles.label}>
                {label}
            </span>
            {children}
        </div>
    );
}