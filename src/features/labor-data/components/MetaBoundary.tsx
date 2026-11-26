import type { ReactNode } from 'react';
import { QueryState } from '../../../shared/components/QueryState';
import { useMeta } from '../hooks';
import type { Meta } from '../types';

/**
 * Every dashboard page needs meta.json (labels, quarters) before it can draw anything.
 * This shows the page loader or error until it's there, then renders the page.
 */
export function MetaBoundary({ children }: { children: (meta: Meta) => ReactNode }) {
    const meta = useMeta();
    return <QueryState query={meta}>{children}</QueryState>;
}