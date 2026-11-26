import { Segmented } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RankedRow } from '../../shared/components/charts/BarList';
import { RankedChartCard } from '../../shared/components/charts/RankedChartCard';
import { ChartGrid, PageStack } from '../../shared/components/layout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useLocalized } from '../../shared/i18n/useLocalized';
import { usePeriodLabel } from '../../shared/i18n/usePeriodLabel';
import { GenderFilter } from '../labor-data/components/GenderFilter';
import { MetaBoundary } from '../labor-data/components/MetaBoundary';
import { MethodologyNote } from '../labor-data/components/MethodologyNote';
import { NationalityFilter } from '../labor-data/components/NationalityFilter';
import { PeriodFilter } from '../labor-data/components/PeriodFilter';
import { TrendChartCard } from '../labor-data/components/TrendChartCard';
import { useQuarter, useTimeseries } from '../labor-data/hooks';
import { categoryRows } from '../labor-data/selectors';
import type { Meta } from '../labor-data/types';
import { useGenderFilter, useNationalityFilter, usePeriodFilter } from '../labor-data/useLaborFilters';
import { useSeriesStyles } from '../labor-data/useSeriesStyles';
import { ChartCard } from '../../shared/components/ChartCard';
import { DonutChart } from '../../shared/components/charts/DonutChart';
import { ProportionBar } from '../../shared/components/charts/ProportionBar';
import { toLoadStatus } from '../../shared/lib/queryStatus';

const TOP_ACTIVITIES = 10;

/** The largest rows first, cut to `count`. */
function topRows(rows: readonly RankedRow[], count: number): RankedRow[] {
    return rows
        .filter((row) => row.value != null)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
        .slice(0, count);
}

export function EmploymentPage() {
    return <MetaBoundary>{(meta) => <EmploymentContent meta={meta} />}</MetaBoundary>;
}

function EmploymentContent({ meta }: { meta: Meta }) {
    const { t } = useTranslation();
    const localize = useLocalized();
    const periodLabel = usePeriodLabel();
    const { nationality: nationalityStyle, genderLines, sectorLines } = useSeriesStyles();

    const [nationality, setNationality] = useNationalityFilter();
    const [gender, setGender] = useGenderFilter();
    const { period, setPeriod, periods } = usePeriodFilter(meta);
    const [showAllActivities, setShowAllActivities] = useState(false);

    const timeseries = useTimeseries();
    const quarter = useQuarter(period);
    const tables = quarter.data?.data;
    const group = t(`nationality.${nationality}`);
    const forPeriod = t('common.forPeriod', { period: periodLabel(period) });
    const barColor = nationalityStyle(nationality).color;

    const rowsFor = (key: 'employed_by_occupation' | 'employed_by_education' | 'employed_by_activity') => {
        const labels = {
            employed_by_occupation: meta.categories.occupation,
            employed_by_education: meta.categories.education,
            employed_by_activity: meta.categories.activity,
        }[key];
        return categoryRows(tables?.[key], labels, localize, nationality, gender);
    };
    const occupationRows = rowsFor('employed_by_occupation');
    const educationRows = rowsFor('employed_by_education');
    const activityRows = rowsFor('employed_by_activity');

    return (
        <>
            <PageHeader
                title={t('employment.title')}
                description={t('employment.description')}
                extra={
                    <>
                        <NationalityFilter value={nationality} onChange={setNationality} />
                        <GenderFilter value={gender} onChange={setGender} />
                        <PeriodFilter periods={periods} value={period} onChange={setPeriod} />
                    </>
                }
            />

            <PageStack>
                <MethodologyNote />

                <ChartGrid>
                    <TrendChartCard
                        title={t('employment.charts.ratioTrend', { group })}
                        description={t('employment.charts.ratioTrendDesc')}
                        query={timeseries}
                        lines={genderLines('employment_to_population_ratio', nationality, ['male', 'female', 'total'])}
                    />
                    <TrendChartCard
                        title={t('employment.charts.sectorTrend')}
                        description={t('employment.charts.sectorTrendDesc')}
                        query={timeseries}
                        lines={sectorLines(nationality, gender)}
                        variant="area"
                    />
                </ChartGrid>

                {/*
       Three different questions, three different charts:
       occupations are parts of a whole (donut), education levels have an order (one 100% bar,
       light to deep), and sectors are a ranking (bar list, below).
     */}
                <ChartGrid>
                    <ChartCard
                        title={t('employment.charts.occupation')}
                        description={t('employment.charts.occupationDesc', { period: periodLabel(period) })}
                        status={toLoadStatus(quarter, () => occupationRows.every((row) => row.value == null))}
                        error={quarter.error}
                        onRetry={() => void quarter.refetch()}
                        fitContent
                    >
                        <DonutChart
                            rows={occupationRows}
                            color={barColor}
                            format="percent"
                            ariaLabel={t('employment.charts.occupation')}
                        />
                    </ChartCard>

                    <ChartCard
                        title={t('employment.charts.education')}
                        description={t('employment.charts.educationDesc', { period: periodLabel(period) })}
                        status={toLoadStatus(quarter, () => educationRows.every((row) => row.value == null))}
                        error={quarter.error}
                        onRetry={() => void quarter.refetch()}
                        fitContent
                    >
                        <ProportionBar
                            rows={educationRows}
                            color={barColor}
                            format="percent"
                            ariaLabel={t('employment.charts.education')}
                        />
                    </ChartCard>
                </ChartGrid>

                <RankedChartCard
                    title={t('employment.charts.activity')}
                    description={forPeriod}
                    extra={
                        <Segmented<'top' | 'all'>
                            size="small"
                            value={showAllActivities ? 'all' : 'top'}
                            onChange={(value) => setShowAllActivities(value === 'all')}
                            options={[
                                { value: 'top', label: t('employment.showTop', { count: TOP_ACTIVITIES }) },
                                { value: 'all', label: t('employment.showAll') },
                            ]}
                        />
                    }
                    query={quarter}
                    rows={showAllActivities ? activityRows : topRows(activityRows, TOP_ACTIVITIES)}
                    color={barColor}
                    format="percent"
                    expectedRows={TOP_ACTIVITIES}
                />
            </PageStack>
        </>
    );
}