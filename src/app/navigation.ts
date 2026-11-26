/** One list drives both the router and the header menu, so they can't drift apart. */
export const NAV_ITEMS = [
    { path: '/', labelKey: 'nav.overview' },
    { path: '/unemployment', labelKey: 'nav.unemployment' },
    { path: '/employment', labelKey: 'nav.employment' },
    { path: '/regions', labelKey: 'nav.regions' },
    { path: '/wages', labelKey: 'nav.wages' },
    { path: '/women', labelKey: 'nav.womenShort' },
    { path: '/about', labelKey: 'nav.about' },

] as const ;

/** The menu key for a URL: "/regions?year=2025" -> "/regions" */
export function activeNavPath(pathname: string): string {
    if (pathname === '/') return '/';
    return NAV_ITEMS.find((item) => item.path !== '/' && pathname.startsWith(item.path))?.path ?? pathname;
}