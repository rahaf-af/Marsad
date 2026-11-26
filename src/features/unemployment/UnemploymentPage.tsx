import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GroupedChartCard } from '../../shared/components/charts/GroupedChartCard';
import { RankedChartCard } from '../../shared/components/charts/RankedChartCard';
import { ChartGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { MethodologyNote } from '../labor-data/components/MethodologyNote';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { PeriodFilter } from '../labor-data/components/PeriodFilter';
import { TrendChartCard } from '../labor-data/components/TrendChartCard';
import { useQuarter, useTimeseries } from '../labor-data/hooks';
import { categoryRows, groupedCategoryRows } from '../labor-data/selectors';
import type { Meta } from '../labor-data/types';
import { useNationalityFilter, usePeriodFilter } from '../labor-data/useLaborFilters';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';

export function UnemploymentPage() {
    return <MetaBoundary>{(meta) => <UnemploymentContent meta={meta} />}</MetaBoundary>;
}

function UnemploymentContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const { dir } = useLanguage();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const { nationality: nationalityStyle, genderLines, genderBars } = useSeriesStyles();

    const [nationality, setNationality] = useNationalityFilter();
    const { period, setPeriod, periods } = usePeriodFilter(meta);

    const timeseries = useTimeseries();
    const quarter = useQuarter(period);
    const tables = quarter.data?.data;
    const group = t(`nationality.${nationality}`);
    const forPeriod = t('common.forPeriod', { period: periodLabel(period) });
    const ageBars = genderBars(['male', 'female']);
    const ForwardArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

    return (
        <>
            <PageHeader
                title={t('unemployment.title')}
                description={t('unemployment.description')}
                extra={
                    <>
                        <NationalityFilter value={nationality} onChange={setNationality} />
                        <PeriodFilter periods={periods} value={period} onChange={setPeriod} />
                    </>
                }
            />

            <PageStack>
                <MethodologyNote />

                <TrendChartCard
                    title={t('unemployment.charts.trend', { group })}
                    description={t('unemployment.charts.trendDesc')}
                    query={timeseries}
                    lines={genderLines('unemployment_rate', nationality, ['male', 'female', 'total'])}
                />

                <ChartGrid>
                    <GroupedChartCard
                        title={t('unemployment.charts.byAge')}
                        description={forPeriod}
                        query={quarter}
                        data={groupedCategoryRows(
                            tables?.unemployment_by_age,
                            meta.categories.age,
                            localize,
                            ageBars.map((bar) => ({ key: bar.key, nationality, gender: bar.key })),
                        )}
                        xKey="label"
                        series={ageBars}
                        format="percent"
                    />

                    <RankedChartCard
                        title={t('unemployment.charts.byRegion')}
                        description={forPeriod}
                        extra={
                            <Link to={`/regions?nationality=${nationality}&period=${period}`}>
                                {t('unemployment.seeRegions')} <ForwardArrow size={14} aria-hidden />
                            </Link>
                        }
                        query={quarter}
                        rows={categoryRows(tables?.unemployment_by_region, meta.categories.region, localize, nationality, 'total')}
                        color={nationalityStyle(nationality).color}
                        format="percent"
                        expectedRows={13}
                    />
                </ChartGrid>
            </PageStack>
        </>
    );
}