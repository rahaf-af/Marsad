import { Globe, Percent, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChartCard } from '../../shared/components/ChartCard';
import { DumbbellChart } from '../../shared/components/charts/DumbbellChart';
import { GroupedBarList } from '../../shared/components/charts/GroupedBarList';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { KpiCard } from '../../shared/components/KpiCard';
import { ChartGrid, KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { toLoadStatus } from '../../shared/lib/queryStatus';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { PeriodFilter } from '../labor-data/components/PeriodFilter';
import { useQuarter } from '../labor-data/hooks';
import { difference, groupedCategoryRows, isTableEmpty, pick } from '../labor-data/selectors';
import type { Meta, Nationality, QuarterData } from '../labor-data/types';
import { useNationalityFilter, usePeriodFilter } from '../labor-data/useLaborFilters';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';

const ICON_SIZE = 20;

/** Average wage for a group, from the "total" row of the wage-by-age table. */
function averageWage(quarter: QuarterData | undefined, nationality: Nationality) {
    return pick(quarter?.data.wage_by_age?.total, nationality, 'total');
}

/** How much less women earn than men, as a percentage of men's wage. */
function genderPayGap(quarter: QuarterData | undefined, nationality: Nationality) {
    const men = pick(quarter?.data.wage_by_age?.total, nationality, 'male');
    const women = pick(quarter?.data.wage_by_age?.total, nationality, 'female');
    return men != null && women != null && men > 0 ? ((men - women) / men) * 100 : null;
}

export function WagesPage() {
    return <MetaBoundary>{(meta) => <WagesContent meta={meta} />}</MetaBoundary>;
}

function WagesContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const { genderBars } = useSeriesStyles();

    const [nationality, setNationality] = useNationalityFilter();
    const { period, setPeriod, periods } = usePeriodFilter(meta);

    // The quarter before the selected one, for "vs last quarter" on the KPI cards.
    const sorted = [...periods].sort();
    const previousPeriod = sorted[sorted.indexOf(period) - 1];

    const quarter = useQuarter(period);
    const previous = useQuarter(previousPeriod);
    const tables = quarter.data?.data;
    const group = t(`nationality.${nationality}`);
    const compared = previousPeriod ? t('common.comparedTo', { period: periodLabel(previousPeriod) }) : undefined;

    const wageKpi = (n: Nationality) => {
        const value = averageWage(quarter.data, n);
        return { value, change: difference(value, averageWage(previous.data, n)), comparisonLabel: compared };
    };

    const [male, female] = genderBars(['male', 'female']);
    const genderSpecs = [male, female].map((g) => ({ key: g.key, nationality, gender: g.key }));

    return (
        <>
            <PageHeader
                title={t('wages.title')}
                description={t('wages.description')}
                extra={
                    <>
                        <NationalityFilter value={nationality} onChange={setNationality} />
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
                            title={t('wages.kpi.average', { group: t('nationality.saudi') })}
                            icon={<Wallet size={ICON_SIZE} />}
                            {...wageKpi('saudi')}
                            format="currency"
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('wages.kpi.average', { group: t('nationality.nonSaudi') })}
                            icon={<Wallet size={ICON_SIZE} />}
                            {...wageKpi('nonSaudi')}
                            format="currency"
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('wages.kpi.averageAll')}
                            icon={<Globe size={ICON_SIZE} />}
                            {...wageKpi('total')}
                            format="currency"
                            loading={quarter.isPending}
                        />
                        <KpiCard
                            title={t('wages.kpi.gap', { group })}
                            icon={<Percent size={ICON_SIZE} />}
                            value={genderPayGap(quarter.data, nationality)}
                            comparisonLabel={t('wages.kpi.gapHint')}
                            loading={quarter.isPending}
                        />
                    </KpiGrid>
                )}

                <ChartGrid>
                    {/* Men and women at each age as two dots: the bar between them is the pay gap. */}
                    <ChartCard
                        title={t('wages.charts.byAge', { group })}
                        description={t('wages.charts.byAgeDesc', { period: periodLabel(period) })}
                        status={toLoadStatus(quarter, () => isTableEmpty(tables?.wage_by_age, nationality, 'total'))}
                        error={quarter.error}
                        onRetry={() => void quarter.refetch()}
                        fitContent
                    >
                        <DumbbellChart
                            data={groupedCategoryRows(tables?.wage_by_age, meta.categories.age, localize, genderSpecs)}
                            series={[male, female]}
                            format="currency"
                            ariaLabel={t('wages.charts.byAge', { group })}
                        />
                    </ChartCard>

                    {/* Only three sectors, so full-width bars with their values instead of a mostly empty chart. */}
                    <ChartCard
                        title={t('wages.charts.byActivity', { group })}
                        description={t('wages.charts.byActivityDesc', { period: periodLabel(period) })}
                        status={toLoadStatus(quarter, () => isTableEmpty(tables?.wage_by_activity_group, nationality, 'total'))}
                        error={quarter.error}
                        onRetry={() => void quarter.refetch()}
                        emptyMessage={t('wages.activityFrom2024')}
                        fitContent
                    >
                        <GroupedBarList
                            data={groupedCategoryRows(
                                tables?.wage_by_activity_group,
                                meta.categories.wageActivityGroup,
                                localize,
                                genderSpecs,
                            )}
                            series={[male, female]}
                            format="currency"
                            ariaLabel={t('wages.charts.byActivity', { group })}
                        />
                    </ChartCard>
                </ChartGrid>
            </PageStack>
        </>
    );
}