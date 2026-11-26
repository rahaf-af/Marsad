import { ConfigProvider, Drawer, Layout, Menu, Button, type MenuProps } from 'antd';
import { Mail, Menu as MenuIcon } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo';
import { SaduWeave } from '../../shared/components/sadu/SaduWeave';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { formatYear } from '../../shared/lib/format';
import { getOnBrandTheme } from '../../shared/theme/antdTheme';
import { layout } from '../../shared/theme/tokens';
import { useThemeMode } from '../../shared/theme/useTheme';
import { activeNavPath, NAV_ITEMS } from '../navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SaduIconLink } from '../../shared/components/sadu/SaduIconLink';
import { CONTACT } from '../contact';

import styles from './AppLayout.module.css';

const { Header, Content, Footer } = Layout;

export function AppLayout() {
    const { t } = useTranslation();
    const { lang, dir } = useLanguage();
    const { resolvedMode } = useThemeMode();
    const { pathname } = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const onBrandTheme = useMemo(() => getOnBrandTheme(resolvedMode), [resolvedMode]);

    const items: MenuProps['items'] = NAV_ITEMS.map((item) => ({
        key: item.path,
        label: <Link to={item.path}>{t(item.labelKey)}</Link>,
    }));
    const selectedKeys = [activeNavPath(pathname)];

    return (
        <Layout className={styles.layout}>
            {/* The header sits on brand green in both modes; see getOnBrandTheme. */}
            <ConfigProvider theme={onBrandTheme}>
                <Header className={styles.header}>
                    {/* Three columns: logo at the start edge, pages in the middle, settings at the end edge. */}
                    <div className={styles.start}>
                        <Button
                            type="text"
                            icon={<MenuIcon size={20} aria-hidden />}
                            className={styles.menuButton}
                            onClick={() => setDrawerOpen(true)}
                            aria-label={t('nav.openMenu')}
                            aria-expanded={drawerOpen}
                            aria-controls="mobile-nav"
                        />
                        <Link to="/" className={styles.brand}>
                            <Logo size={layout.headerLogoSize} />
                            <span className={styles.brandName}>{t('app.name')}</span>
                        </Link>
                    </div>

                    <nav aria-label={t('nav.menu')} className={styles.desktopNav}>
                        {/* disabledOverflow: every page stays visible; below 1100px the drawer takes over. */}
                        <Menu
                            mode="horizontal"
                            selectedKeys={selectedKeys}
                            items={items}
                            disabledOverflow
                            className={styles.horizontalMenu}
                        />
                    </nav>

                    <div className={styles.end}>
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                </Header>
            </ConfigProvider>

            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                placement={dir === 'rtl' ? 'right' : 'left'}
                title={
                    <span className={styles.drawerTitle}>
                        <Logo size={24} />
                        {t('app.name')}
                    </span>
                }
            >
                <nav id="mobile-nav" aria-label={t('nav.menu')}>
                    <Menu
                        mode="inline"
                        selectedKeys={selectedKeys}
                        items={items}
                        onClick={() => setDrawerOpen(false)}
                        className={styles.drawerMenu}
                    />
                </nav>
            </Drawer>

            <Content className={styles.content}>
                <main className={styles.container}>
                    <Outlet />
                </main>
            </Content>

            {/* Compact footer: who and where from on one side, links and rights on the other. */}
            <Footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerStart}>
                        <span className={styles.footerBrand}>
                            <Logo size={20} />
                            {t('app.name')}
                        </span>
                        <span className={styles.footerMeta}>
                            {t('footer.disclaimer')} {t('footer.source')}
                        </span>
                    </div>

                    <div className={styles.footerEnd}>
                        <nav className={styles.contact} aria-label={t('footer.contact')}>
                            {CONTACT.linkedin && (
                                <SaduIconLink href={CONTACT.linkedin} label="LinkedIn" icon={<FaLinkedinIn size={15} />} external />
                            )}
                            {CONTACT.github && (
                                <SaduIconLink href={CONTACT.github} label={t('footer.sourceCode')} icon={<FaGithub size={15} />} external />
                            )}
                            {CONTACT.email && (
                                <SaduIconLink href={`mailto:${CONTACT.email}`} label={t('footer.email')} icon={<Mail size={15} />} />
                            )}
                        </nav>
                        {/* The year comes from the clock, so it never goes stale. */}
                        <span className={styles.copyright}>
                            {t('footer.copyright', { year: formatYear(new Date().getFullYear(), lang) })}
                        </span>
                    </div>
                </div>
            </Footer>

            {/* The page closes with a Sadu fringe, as the green hero opens it. */}
            <SaduWeave variant="edge" />
        </Layout>
    );
}