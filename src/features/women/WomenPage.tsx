import { IdCard, Store, UserMinus, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RankedChartCard } from '../../shared/components/charts/RankedChartCard';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { KpiCard } from '../../shared/components/KpiCard';
import { ChartGrid, KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { MethodologyNote } from '../labor-data/components/MethodologyNote';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { PeriodFilter } from '../labor-data/components/PeriodFilter';
import { TrendChartCard } from '../labor-data/components/TrendChartCard';
import { useQuarter, useTimeseries } from '../labor-data/hooks';
import { categoryRows } from '../labor-data/selectors';
import type { Meta } from '../labor-data/types';
import { useKpi } from '../labor-data/useKpi';
import { useNationalityFilter, usePeriodFilter } from '../labor-data/useLaborFilters';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';

const ICON_SIZE = 20;

export function WomenPage() {
    return <MetaBoundary>{(meta) => <WomenContent meta={meta} />}</MetaBoundary>;
}

function WomenContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const { gender: genderStyle, genderLines } = useSeriesStyles();

    const [nationality, setNationality] = useNationalityFilter();
    const { period, setPeriod, periods } = usePeriodFilter(meta);

    const timeseries = useTimeseries();
    const quarter = useQuarter(period);
    const kpi = useKpi(timeseries.data ?? [], period);
    const group = t(`nationality.${nationality}`);
    const loading = timeseries.isPending;

    return (
        <>
            <PageHeader
                title={t('women.title')}
                description={t('women.description')}
                extra={
                    <>
                        <NationalityFilter value={nationality} onChange={setNationality} />
                        <PeriodFilter periods={periods} value={period} onChange={setPeriod} />
                    </>
                }
            />

            <PageStack>
                {timeseries.isError ? (
                    <ErrorAlert error={timeseries.error} onRetry={() => void timeseries.refetch()} />
                ) : (
                    <KpiGrid>
                        <KpiCard
                            title={t('women.kpi.participation', { group })}
                            icon={<Venus size={ICON_SIZE} />}
                            {...kpi('labor_force_participation_rate', nationality, 'female')}
                            loading={loading}
                        />
                        <KpiCard
                            title={t('women.kpi.unemployment', { group })}
                            icon={<UserMinus size={ICON_SIZE} />}
                            {...kpi('unemployment_rate', nationality, 'female')}
                            positiveIsGood={false}
                            loading={loading}
                        />
                        <KpiCard
                            title={t('women.kpi.employmentRatio', { group })}
                            icon={<IdCard size={ICON_SIZE} />}
                            {...kpi('employment_to_population_ratio', nationality, 'female')}
                            loading={loading}
                        />
                        <KpiCard
                            title={t('women.kpi.privateShare', { group })}
                            icon={<Store size={ICON_SIZE} />}
                            {...kpi('private_sector_share', nationality, 'female')}
                            loading={loading}
                        />
                    </KpiGrid>
                )}

                <MethodologyNote />

                <ChartGrid>
                    <TrendChartCard
                        title={t('women.charts.participationTrend', { group })}
                        description={t('women.charts.trendDesc')}
                        query={timeseries}
                        lines={genderLines('labor_force_participation_rate', nationality, ['female', 'male'])}
                        variant="area"
                    />
                    <TrendChartCard
                        title={t('women.charts.unemploymentTrend', { group })}
                        description={t('women.charts.trendDesc')}
                        query={timeseries}
                        lines={genderLines('unemployment_rate', nationality, ['female', 'male'])}
                    />
                </ChartGrid>

                <RankedChartCard
                    title={t('women.charts.occupation', { group })}
                    description={t('common.forPeriod', { period: periodLabel(period) })}
                    query={quarter}
                    rows={categoryRows(
                        quarter.data?.data.employed_by_occupation,
                        meta.categories.occupation,
                        localize,
                        nationality,
                        'female',
                    )}
                    color={genderStyle('female').color}
                    format="percent"
                />
            </PageStack>
        </>
    );
}