import { Globe, LayoutGrid, List, TrendingDown, TrendingUp } from 'lucide-react';
import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { FilterField } from '../../shared/components/filters/FilterField';
import { KpiCard } from '../../shared/components/KpiCard';
import { PeriodTimeline } from '../../shared/components/filters/PeriodTimeline';
import { KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useSearchParamState } from '../../shared/hooks/useSearchParamState';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { chart } from '../../shared/theme/tokens';
import { GenderFilter } from '../labor-data/components/GenderFilter';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { useQuarter, useQuarters } from '../labor-data/hooks';
import { categoryRows, difference, pick } from '../labor-data/selectors';
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
    const tableKey = indicator === 'unemployment' ? 'unemployment_by_region' : 'participation_by_region';
    const table = quarter.data?.data[tableKey];

    // Every quarter is loaded once, so the timeline moves instantly and the cards can show a trend.
    const sortedPeriods = [...periods].sort();
    const quarters = useQuarters(sortedPeriods);

    /** The KPI extras for one region (or the whole country): recent trend and change from last quarter. */
    const regionKpi = (regionId: string | null) => {
        const end = sortedPeriods.indexOf(period);
        const recent = sortedPeriods.slice(Math.max(0, end - chart.sparklinePoints + 1), end + 1);
        const trend = recent.map((p) => {
            const tbl = quarters[p]?.data[tableKey];
            const values = regionId === null ? tbl?.total : tbl?.categories.find((row) => row.id === regionId)?.values;
            return pick(values, nationality, gender);
        });
        const previousPeriod = end > 0 ? sortedPeriods[end - 1] : undefined;
        return {
            trend,
            change: trend.length > 1 ? difference(trend[trend.length - 1], trend[trend.length - 2]) : null,
            comparisonLabel: previousPeriod ? t('common.comparedTo', { period: periodLabel(previousPeriod) }) : undefined,
            // For unemployment a rise is bad news; for participation it's good news.
            positiveIsGood: indicator === 'participation',
        };
    };

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
                    </>
                }
            />

            <PageStack>
                <PeriodTimeline periods={periods} value={period} onChange={setPeriod} />

                {quarter.isError ? (
                    <ErrorAlert error={quarter.error} onRetry={() => void quarter.refetch()} />
                ) : (
                    <KpiGrid>
                        <KpiCard
                            title={t('regions.kpi.national', { indicator: indicatorLabel })}
                            icon={<Globe size={ICON_SIZE} />}
                            value={pick(table?.total, nationality, gender)}
                            {...regionKpi(null)}
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('regions.kpi.highest', { region: highest?.label ?? '—' })}
                            icon={<TrendingUp size={ICON_SIZE} />}
                            value={highest?.value}
                            {...regionKpi(highest?.id ?? null)}
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('regions.kpi.lowest', { region: lowest?.label ?? '—' })}
                            icon={<TrendingDown size={ICON_SIZE} />}
                            value={lowest?.value}
                            {...regionKpi(lowest?.id ?? null)}
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