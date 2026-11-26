import { Collapse, Typography } from 'antd';
import { Compass, ExternalLink, Eye, MessagesSquare, Target, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChartGrid, KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { SaduPattern } from '../../shared/components/SaduPattern';
import { SectionCard } from '../../shared/components/SectionCard';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { formatNumber } from '../../shared/lib/format';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import type { Meta } from '../labor-data/types';
import { AboutStats } from './AboutStats';
import { SaduStory } from './SaduStory';
import { ValueCard } from './ValueCard';
import styles from './AboutPage.module.css';
import { SaduEye } from '../../shared/components/sadu/SaduEye';
import { layout } from '../../shared/theme/tokens';

const ICON_SIZE = 22;
const DATA_NOTES = ['missingValues', 'notStated', 'wagesByActivity', 'q4_2021'] as const;
const FAQ = ['whatIs', 'official', 'source', 'updates', 'missing', 'participation', 'unemployment'] as const;

/** GASTAT writes each note as "period: method". Splits it, or keeps it whole if there's no colon. */
function splitMethodologyNote(note: string): { period: string | null; method: string } {
    const colon = note.indexOf(':');
    if (colon < 0) return { period: null, method: note };
    return { period: note.slice(0, colon).trim(), method: note.slice(colon + 1).trim() };
}

export function AboutPage() {
    return <MetaBoundary>{(meta) => <AboutContent meta={meta} />}</MetaBoundary>;
}

function AboutContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const [from, to] = meta.timeseriesRange;

    return (
        <>
            <PageHeader title={t('about.title')} description={t('about.description')} extra={<AboutStats meta={meta} />} />

            <PageStack>
                {/* Sections alternate: plain, Sadu, plain, Sadu (the hero above has Sadu too). */}
                <ChartGrid>
                    <SectionCard title={t('about.what.title')}>
                        <Typography.Paragraph>{t('about.what.body')}</Typography.Paragraph>
                        <Typography.Paragraph type="secondary">{t('footer.disclaimer')}</Typography.Paragraph>
                    </SectionCard>

                    <SectionCard title={t('about.source.title')}>
                        <dl className={styles.facts}>
                            <dt>{t('about.source.publisher')}</dt>
                            <dd>
                                <Typography.Link href={meta.source.url} target="_blank" rel="noreferrer">
                                    {localize(meta.source)}
                                </Typography.Link>
                            </dd>
                            <dt>{t('about.source.coverage')}</dt>
                            <dd>{t('about.source.range', { from: periodLabel(from), to: periodLabel(to) })}</dd>
                            <dt>{t('about.source.quarters')}</dt>
                            <dd>{formatNumber(meta.quarters.length, lang)}</dd>
                            <dt>{t('about.source.latest')}</dt>
                            <dd>{periodLabel(meta.latestPeriod)}</dd>
                        </dl>
                    </SectionCard>
                </ChartGrid>

                <KpiGrid>
                    <ValueCard icon={<Eye size={ICON_SIZE} />} title={t('about.vision.title')} body={t('about.vision.body')} />
                    <ValueCard
                        icon={<Compass size={ICON_SIZE} />}
                        title={t('about.mission.title')}
                        body={t('about.mission.body')}
                    />
                    <ValueCard icon={<Target size={ICON_SIZE} />} title={t('about.goals.title')} body={t('about.goals.body')} />
                    <ValueCard
                        icon={<Users size={ICON_SIZE} />}
                        title={t('about.audience.title')}
                        body={t('about.audience.body')}
                    />
                </KpiGrid>

                {/* Data notes as a row of short cards, so they use the full width. */}
                <SectionCard title={t('about.notes.title')}>
                    <ul className={styles.noteGrid}>
                        {DATA_NOTES.map((note) => (
                            <li key={note} className={styles.note}>
                                {t(`about.notes.${note}`)}
                            </li>
                        ))}
                        <li className={styles.note}>{t('common.methodologyNote')}</li>
                    </ul>
                </SectionCard>

                <SaduStory />

                {/* The collection methods in order, as a timeline across the card. */}
                {meta.methodologyNotes.length > 0 && (
                    <SectionCard title={t('about.methodology.title')}>
                        {/* GASTAT publishes these notes in Arabic only, so they keep Arabic direction in both languages. */}
                        <ol className={styles.timeline} lang="ar" dir="rtl">
                            {meta.methodologyNotes.map((note) => {
                                const { period, method } = splitMethodologyNote(note);
                                return (
                                    <li key={note} className={styles.step}>
                                        <SaduEye size={layout.timelineMarkerSize} className={styles.stepMarker} />
                                        {period && <span className={styles.stepPeriod}>{period}</span>}
                                        <span className={styles.stepMethod}>{method}</span>
                                    </li>
                                );
                            })}
                        </ol>
                        {lang !== 'ar' && <p className={styles.caption}>{t('about.methodology.arabicOnly')}</p>}
                    </SectionCard>
                )}


                {/* FAQ: a green Sadu panel on the start side, the questions beside it. */}
                <section className={styles.faq} aria-labelledby="faq-title">
                    <div className={styles.faqAside}>
                        <SaduPattern />
                        <div className={styles.faqAsideContent}>
                            <MessagesSquare size={32} aria-hidden />
                            <h2 id="faq-title" className={styles.faqTitle}>
                                {t('about.faq.title')}
                            </h2>
                            <p className={styles.faqText}>{t('about.faq.description')}</p>
                            <p className={styles.faqText}>{t('about.faq.asideBody')}</p>
                            <a href={meta.source.url} target="_blank" rel="noreferrer" className={styles.faqLink}>
                                {t('about.faq.asideLink')}
                                <ExternalLink size={14} aria-hidden />
                            </a>
                        </div>
                    </div>

                    <div className={styles.faqList}>
                        <Collapse
                            ghost
                            accordion
                            defaultActiveKey={FAQ[0]}
                            items={FAQ.map((key) => ({
                                key,
                                label: <span className={styles.question}>{t(`about.faq.items.${key}.q`)}</span>,
                                children: <p className={styles.answer}>{t(`about.faq.items.${key}.a`)}</p>,
                            }))}
                        />
                    </div>
                </section>
            </PageStack>
        </>
    );
}