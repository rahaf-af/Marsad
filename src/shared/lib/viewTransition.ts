import { flushSync } from 'react-dom';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Lets React render and commit before the browser takes the "after" picture. */
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Runs a UI change (theme, language) inside a View Transition, so the old page cross-fades
 * into the new one instead of switching in a single frame. Browsers without the API (and
 * people who prefer reduced motion) get the change instantly, exactly as before.
 *
 * `update` may be async (e.g. i18next's changeLanguage); the fade waits for it.
 */
export function withViewTransition(update: () => void | Promise<void>): void {
    if (!('startViewTransition' in document) || prefersReducedMotion()) {
        void update();
        return;
    }
    document.startViewTransition(async () => {
        // flushSync makes React apply a synchronous state change right away.
        await flushSync(update);
        await nextTask();
    });
}