import { Globe, LayoutGrid, List, TrendingDown, TrendingUp } from 'lucide-react';
import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { FilterField } from '../../shared/components/filters/FilterField';
import { KpiCard } from '../../shared/components/KpiCard';
import { KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useSearchParamState } from '../../shared/hooks/useSearchParamState';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { GenderFilter } from '../labor-data/components/GenderFilter';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { PeriodFilter } from '../labor-data/components/PeriodFilter';
import { useQuarter } from '../labor-data/hooks';
import { categoryRows, pick } from '../labor-data/selectors';
import type { Meta } from '../labor-data/types';
import { useGenderFilter, useNationalityFilter, usePeriodFilter } from '../labor-data/useLaborFilters';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';
import { RegionTiles } from './RegionTiles';
import { RegionsTable } from './RegionsTable';
import styles from './RegionsPage.module.css';


const ICON_SIZE = 20;
const INDICATORS = ['unemployment', 'participation'] as const;
type RegionIndicator = (typeof INDICATORS)[number];
const VIEWS = ['tiles', 'table'] as const;
type RegionsView = (typeof VIEWS)[number];

export function RegionsPage() {
    return <MetaBoundary>{(meta) => <RegionsContent meta={meta} />}</MetaBoundary>;
}

function RegionsContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const { nationality: nationalityStyle } = useSeriesStyles();

    const [indicator, setIndicator] = useSearchParamState<RegionIndicator>('indicator', INDICATORS, 'unemployment');
    const [nationality, setNationality] = useNationalityFilter();
    const [gender, setGender] = useGenderFilter();
    const { period, setPeriod, periods } = usePeriodFilter(meta);
    const [view, setView] = useSearchParamState<RegionsView>('view', VIEWS, 'tiles');

    const quarter = useQuarter(period);
    const table =
        indicator === 'unemployment'
            ? quarter.data?.data.unemployment_by_region
            : quarter.data?.data.participation_by_region;

    const rows = categoryRows(table, meta.categories.region, localize, nationality, gender);
    const ranked = rows.filter((row) => row.value != null).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    const highest = ranked[0];
    const lowest = ranked[ranked.length - 1];
    const indicatorLabel = t(`indicators.${indicator}`);
    // For unemployment a high value is bad news; for participation it's good news.
    const rankingHint = indicator === 'participation' ? 'regions.charts.rankingDescGood' : 'regions.charts.rankingDescBad';
    const rankingTitle = t('regions.charts.ranking', { indicator: indicatorLabel });
    const rankingDescription = t(rankingHint, { period: periodLabel(period) });

    // One card that switches between tiles and a table, instead of two cards of different heights.
    const viewSwitch = (
        <Segmented<RegionsView>
            size="small"
            value={view}
            onChange={setView}
            options={[
                { value: 'tiles', icon: <LayoutGrid size={14} aria-hidden />, label: t('regions.view.tiles') },
                { value: 'table', icon: <List size={14} aria-hidden />, label: t('regions.view.table') },
            ]}
        />
    );

    return (
        <>
            <PageHeader
                title={t('regions.title')}
                description={t('regions.description')}
                extra={
                    <>
                        <FilterField label={t('filters.indicator')}>
                            <Segmented<RegionIndicator>
                                value={indicator}
                                onChange={setIndicator}
                                options={INDICATORS.map((i) => ({ value: i, label: t(`indicators.${i}`) }))}
                            />
                        </FilterField>
                        <NationalityFilter value={nationality} onChange={setNationality} />
                        <GenderFilter value={gender} onChange={setGender} />
                        <PeriodFilter periods={periods} value={period} onChange={setPeriod} />
                    </>
                }
            />

            <PageStack>
                {quarter.isError ? (
                    <ErrorAlert error={quarter.error} onRetry={() => void quarter.refetch()} />
                ) : (
                    <KpiGrid>
                        <KpiCard
                            title={t('regions.kpi.national', { indicator: indicatorLabel })}
                            icon={<Globe size={ICON_SIZE} />}
                            value={pick(table?.total, nationality, gender)}
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('regions.kpi.highest', { region: highest?.label ?? '—' })}
                            icon={<TrendingUp size={ICON_SIZE} />}
                            value={highest?.value}
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('regions.kpi.lowest', { region: lowest?.label ?? '—' })}
                            icon={<TrendingDown size={ICON_SIZE} />}
                            value={lowest?.value}
                            loading={quarter.isPending}
                        />
                    </KpiGrid>
                )}

                {view === 'tiles' ? (
                    // The tiles card stretches to the bottom of the screen; the tiles grow with it.
                    <div className={styles.grow}>
                        <RegionTiles
                            title={rankingTitle}
                            description={rankingDescription}
                            extra={viewSwitch}
                            query={quarter}
                            rows={rows}
                            color={nationalityStyle(nationality).color}
                        />
                    </div>
                ) : (
                    <RegionsTable
                        title={rankingTitle}
                        description={rankingDescription}
                        extra={viewSwitch}
                        rows={rows}
                        valueLabel={indicatorLabel}
                        nationalValue={pick(table?.total, nationality, gender)}
                        higherIsBetter={indicator === 'participation'}
                        color={nationalityStyle(nationality).color}
                        loading={quarter.isPending}
                    />
                )}
            </PageStack>
        </>
    );
}