import { Table, type TableColumnsType } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { RankedRow } from '../../shared/components/charts/BarList';
import { SectionCard } from '../../shared/components/SectionCard';
import { useLanguage } from '../../shared/i18n/useLanguage';
import { formatChange, formatPercent } from '../../shared/lib/format';
import styles from './RegionsTable.module.css';

interface RegionsTableProps {
    title: string;
    description?: string;
    /** Controls next to the title, e.g. the tiles / table switch. */
    extra?: ReactNode;
    rows: readonly RankedRow[];
    valueLabel: string;
    /** The kingdom-wide value, to show how far each region is above or below it. */
    nationalValue: number | null | undefined;
    /** Participation: higher is good news. Unemployment: lower is. Colors the difference. */
    higherIsBetter: boolean;
    color: string;
    loading: boolean;
}

interface TableRow extends RankedRow {
    rank: number | null;
    diff: number | null;
}

/** Below this width the table scrolls sideways instead of squeezing the bar column. */
const MIN_TABLE_WIDTH = 250;

/**
 * The ranking as a sortable table, full width: rank, region, value, a bar for its size,
 * and how far it is from the national figure.
 */
export function RegionsTable({
    title,
    description,
    extra,
    rows,
    valueLabel,
    nationalValue,
    higherIsBetter,
    color,
    loading,
}: RegionsTableProps) {
    const { t } = useTranslation();
    const { lang } = useLanguage();

    const ranked = rows.filter((row) => row.value != null).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    const max = ranked[0]?.value || 1;
    const data: TableRow[] = rows.map((row) => {
        const position = ranked.findIndex((r) => r.id === row.id);
        return {
            ...row,
            rank: position >= 0 ? position + 1 : null,
            diff: row.value != null && nationalValue != null ? row.value - nationalValue : null,
        };
    });

    const diffTone = (diff: number) => {
        if (Math.abs(diff) < 0.05) return styles.neutral;
        return diff > 0 === higherIsBetter ? styles.good : styles.bad;
    };

    const columns: TableColumnsType<TableRow> = [
        { title: t('regions.table.region'), dataIndex: 'label' },
        {
            // The value with a small bar beside it: enough to compare at a glance, without a wide column.
            title: valueLabel,
            dataIndex: 'value',
            sorter: (a, b) => (a.value ?? -1) - (b.value ?? -1),
            render: (value: number | null) =>
                value == null ? (
                    t('common.notAvailableShort')
                ) : (
                    <span className={styles.valueCell}>
                        <span className={styles.value}>{formatPercent(value, lang)}</span>
                        <span className={styles.track} aria-hidden>
                            <span className={styles.bar} style={{ '--bar-size': value / max } as CSSProperties} />
                        </span>
                    </span>
                ),
        },
        {
            title: t('regions.table.vsNational'),
            dataIndex: 'diff',
            sorter: (a, b) => (a.diff ?? -Infinity) - (b.diff ?? -Infinity),
            render: (diff: number | null) =>
                diff == null ? (
                    '—'
                ) : (
                    <span className={`${styles.diff} ${diffTone(diff)}`}>
                        {formatChange(diff, lang)} {t('common.percentagePoints')}
                    </span>
                ),
        },
    ];

    return (
        <SectionCard title={title} description={description} extra={extra}>
            <div style={{ '--bar-color': color } as CSSProperties}>
                <Table<TableRow>
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    size="middle"
                    scroll={{ x: MIN_TABLE_WIDTH }}
                />
            </div>
        </SectionCard>
    );
}