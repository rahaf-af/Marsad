import { useId } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatAxisValue, type ValueFormat } from '../../lib/format';
import { SaduMarkerShape } from '../sadu/SaduMarker';
import { chart } from '../../theme/tokens';
import { ChartLegend, type SeriesDef } from './ChartLegend';
import { ChartTooltip } from './ChartTooltip';
import { useChartSettings } from './useChartSettings';
import styles from './charts.module.css';

/** The hovered point is drawn as a Sadu eye in the line's color, like the points in the logo. */
const saduDot =
  (color: string) =>
  ({ cx = 0, cy = 0 }: { cx?: number; cy?: number }) => (
    <SaduMarkerShape cx={cx} cy={cy} size={chart.markerSize} color={color} halo />
  );
export type ChartRow = Record<string, string | number | null>;

/** "line" for comparing several series; "area" for one or two, to give the trend more weight. */
export type TrendVariant = 'line' | 'area';

interface TrendLineChartProps {
    data: ChartRow[];
    /** Field holding the x value, e.g. "period". */
    xKey: string;
    series: readonly SeriesDef[];
    format: ValueFormat;
    variant?: TrendVariant;
    /** Short label under the axis. */
    xTickFormatter?: (value: string) => string;
    /** Full label in the tooltip. */
    xLabelFormatter?: (value: string) => string;
    /** What the chart shows, for screen readers. */
    ariaLabel: string;
}

/**
 * Values over time (or along any ordered axis). In Arabic time runs right-to-left and the
 * value axis moves to the right. A missing value leaves a gap instead of dropping to zero.
 */
export function TrendLineChart({
    data,
    xKey,
    series,
    format,
    variant = 'line',
    xTickFormatter,
    xLabelFormatter,
    ariaLabel,
}: TrendLineChartProps) {
    const s = useChartSettings();
    // Gradient ids must be unique on the page, since several charts can share a series key.
    const gradientId = useId();

    return (
        <div className={styles.frame} role="img" aria-label={ariaLabel}>
            <ChartLegend series={series} />
            <div className={styles.plot} dir={s.svgDir}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={s.margin}>
                        {variant === 'area' && (
                            <defs>
                                {series.map((line) => (
                                    <linearGradient key={line.key} id={`${gradientId}-${line.key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={line.color} stopOpacity={chart.areaOpacity} />
                                        <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                        )}
                        <CartesianGrid stroke={s.gridStroke} vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            reversed={s.isRtl}
                            tick={s.tick}
                            tickFormatter={(value) => (xTickFormatter ? xTickFormatter(String(value)) : String(value))}
                            stroke={s.axisStroke}
                            tickMargin={s.tickMargin}
                            minTickGap={s.minTickGap}
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
                            cursor={{ stroke: s.axisStroke }}
                            content={({ active, payload, label }) => (
                                <ChartTooltip
                                    active={active}
                                    payload={payload}
                                    label={label}
                                    format={format}
                                    labelFormatter={xLabelFormatter}
                                />
                            )}
                        />
                        {series.map((line) =>
                            variant === 'area' ? (
                                <Area
                                    key={line.key}
                                    type="monotone"
                                    dataKey={line.key}
                                    name={line.label}
                                    stroke={line.color}
                                    strokeWidth={chart.lineWidth}
                                    fill={`url(#${gradientId}-${line.key})`}
                                    activeDot={saduDot(line.color)}
                                    connectNulls={false}
                                    isAnimationActive={s.animate}
                                />
                            ) : (
                                <Line
                                    key={line.key}
                                    type="monotone"
                                    dataKey={line.key}
                                    name={line.label}
                                    stroke={line.color}
                                    strokeWidth={chart.lineWidth}
                                    dot={false}
                                    activeDot={saduDot(line.color)}
                                    connectNulls={false}
                                    isAnimationActive={s.animate}
                                />
                            ),
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}