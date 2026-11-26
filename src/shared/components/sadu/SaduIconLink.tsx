import type { ReactNode } from 'react';
import { steppedDiamond } from './saduShapes';
import styles from './SaduIconLink.module.css';

/** The diamond is 12 stitches across; each stitch is UNIT px (36px in all). */
const STITCHES = 12;
const UNIT = 3;
const SIZE = STITCHES * UNIT;
const DIAMOND = steppedDiamond(STITCHES / 2, STITCHES / 2, STITCHES / 2, UNIT);

interface SaduIconLinkProps {
    href: string;
    /** Read by screen readers and shown on hover, since the link is icon-only. */
    label: string;
    /** A small Lucide icon, about 14px. */
    icon: ReactNode;
    /** Opens in a new tab (for other sites). */
    external?: boolean;
}

/** An icon link in a stitched Sadu diamond, the same motif as the rest of the site. */
export function SaduIconLink({ href, label, icon, external = false }: SaduIconLinkProps) {
    return (
        <a
            className={styles.link}
            href={href}
            aria-label={label}
            title={label}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
            <svg className={styles.diamond} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
                <path d={DIAMOND} />
            </svg>
            <span className={styles.icon} aria-hidden>
                {icon}
            </span>
        </a>
    );
}