import { Globe, UserMinus, Users, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { KpiCard } from '../../shared/components/KpiCard';
import { ChartGrid, KpiGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { MethodologyNote } from '../labor-data/components/MethodologyNote';
import { TrendChartCard } from '../labor-data/components/TrendChartCard';
import { useTimeseries } from '../labor-data/hooks';
import type { Meta } from '../labor-data/types';
import { useKpi } from '../labor-data/useKpi';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';

const ICON_SIZE = 20;

export function OverviewPage() {
    return <MetaBoundary>{(meta) => <OverviewContent meta={meta} />}</MetaBoundary>;
}

function OverviewContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const periodLabel = usePeriodLabel();
    const timeseries = useTimeseries();
    const { nationalityLines, sectorLines } = useSeriesStyles();
    const kpi = useKpi(timeseries.data ?? [], meta.latestPeriod);
    const loading = timeseries.isPending;

    return (
        <>
            <PageHeader
                title={t('overview.title')}
                description={t('overview.description', { period: periodLabel(meta.latestPeriod) })}
            />

            <PageStack>
                {timeseries.isError ? (
                    <ErrorAlert error={timeseries.error} onRetry={() => void timeseries.refetch()} />
                ) : (
                    <KpiGrid>
                        <KpiCard
                            title={t('overview.kpi.saudiUnemployment')}
                            icon={<UserMinus size={ICON_SIZE} />}
                            {...kpi('unemployment_rate', 'saudi', 'total')}
                            positiveIsGood={false}
                            to="/unemployment"
                            loading={loading}
                        />
                        <KpiCard
                            title={t('overview.kpi.totalUnemployment')}
                            icon={<Globe size={ICON_SIZE} />}
                            {...kpi('unemployment_rate', 'total', 'total')}
                            positiveIsGood={false}
                            to="/unemployment?nationality=total"
                            loading={loading}
                        />
                        <KpiCard
                            title={t('overview.kpi.saudiParticipation')}
                            icon={<Users size={ICON_SIZE} />}
                            {...kpi('labor_force_participation_rate', 'saudi', 'total')}
                            to="/employment"
                            loading={loading}
                        />
                        <KpiCard
                            title={t('overview.kpi.saudiWomenParticipation')}
                            icon={<Venus size={ICON_SIZE} />}
                            {...kpi('labor_force_participation_rate', 'saudi', 'female')}
                            to="/women"
                            loading={loading}
                        />
                    </KpiGrid>
                )}

                <MethodologyNote />

                <ChartGrid>
                    <TrendChartCard
                        title={t('overview.charts.unemploymentTrend')}
                        description={t('overview.charts.unemploymentTrendDesc')}
                        query={timeseries}
                        lines={nationalityLines('unemployment_rate', 'total', ['saudi', 'nonSaudi', 'total'])}
                    />
                    <TrendChartCard
                        title={t('overview.charts.sectorTrend')}
                        description={t('overview.charts.sectorTrendDesc')}
                        query={timeseries}
                        lines={sectorLines('saudi', 'total')}
                        variant="area"
                    />
                </ChartGrid>
            </PageStack>
        </>
    );
}