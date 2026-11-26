import { useTranslation } from 'react-i18next';
import { SaduWeave } from '../../shared/components/sadu/SaduWeave';
import styles from './SaduStory.module.css';

const FACTS = ['unesco', 'g20', 'mersad'] as const;

/**
 * "Why Al Sadu?": the story behind the site's identity, with a woven Sadu strip down the
 * end side, like the selvedge of a tent panel. The FAQ block has its green panel on the
 * start side, so the page zigzags. On small screens the strip runs across the top instead.
 */
export function SaduStory() {
    const { t } = useTranslation();

    return (
        <section className={styles.story} aria-labelledby="sadu-title">
            <SaduWeave orientation="horizontal" className={styles.weaveTop} />

            <div className={styles.content}>
                <div className={styles.intro}>
                    <h2 id="sadu-title" className={styles.title}>
                        {t('about.saduStory.title')}
                    </h2>
                    <p className={styles.body}>{t('about.saduStory.body')}</p>
                    <p className={styles.body}>{t('about.saduStory.whyMersad')}</p>
                </div>

                <dl className={styles.facts}>
                    {FACTS.map((fact) => (
                        <div key={fact} className={styles.fact}>
                            <dt className={styles.factValue}>{t(`about.saduStory.facts.${fact}.value`)}</dt>
                            <dd className={styles.factLabel}>{t(`about.saduStory.facts.${fact}.label`)}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <SaduWeave orientation="vertical" className={styles.weaveSide} />
        </section>
    );
}