import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatAxisValue, type ValueFormat } from '../../lib/format';
import { chart } from '../../theme/tokens';
import { ChartLegend, type SeriesDef } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';
import type { ChartRow } from './TrendLineChart';
import { useChartSettings } from './useChartSettings';
import styles from './charts.module.css';

interface GroupedBarChartProps {
    data: ChartRow[];
    /** Field holding the category name, e.g. "label". */
    xKey: string;
    series: readonly SeriesDef[];
    format: ValueFormat;
    ariaLabel: string;
}

/** Side-by-side bars per category, e.g. men vs women in each age group. */
export function GroupedBarChart({ data, xKey, series, format, ariaLabel }: GroupedBarChartProps) {
    const s = useChartSettings();

    return (
        <div className={styles.frame} role="img" aria-label={ariaLabel}>
            <ChartLegend series={series} />
            <div className={styles.plot} dir={s.svgDir}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={s.margin} barGap={chart.barRadius}>
                        <CartesianGrid stroke={s.gridStroke} vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            reversed={s.isRtl}
                            tick={s.tick}
                            stroke={s.axisStroke}
                            interval={0}
                            tickMargin={s.tickMargin}
                        />
                        <YAxis
                            orientation={s.isRtl ? 'right' : 'left'}
                            tick={s.tick}
                            tickFormatter={(value: number) => formatAxisValue(value, format, s.lang)}
                            width={chart.valueAxisWidth[format]}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: s.cursorFill }}
                            content={({ active, payload, label }) => (
                                <ChartTooltip active={active} payload={payload} label={label} format={format} />
                            )}
                        />
                        {series.map((bar) => (
                            <Bar
                                key={bar.key}
                                dataKey={bar.key}
                                name={bar.label}
                                fill={bar.color}
                                radius={[chart.barRadius, chart.barRadius, 0, 0]}
                                maxBarSize={chart.groupedBarThickness}
                                isAnimationActive={s.animate}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}