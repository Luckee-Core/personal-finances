'use client';

import { useMemo, useState } from 'react';
import { formatCents } from '@/utils/format-cents';
import { useAiCostsTableRows } from './use-ai-costs-table-rows';

const DAY_OPTIONS = [
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '365 days', value: 365 },
] as const;

const LOGICAL_LABELS: Record<string, string> = {
  transaction_slug_assign: 'Slug assign',
  transaction_category_assign: 'Category assign',
  recurring_detect: 'Recurring detect',
};

const formatSource = (logicalKey: string): string =>
  LOGICAL_LABELS[logicalKey] ?? logicalKey.replace(/_/g, ' ');

const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

export const AiCostsPage = () => {
  const [days, setDays] = useState<number>(30);
  const rows = useAiCostsTableRows(days);

  const totalCostCents = useMemo(
    () => rows.reduce((sum, row) => sum + row.costCents, 0),
    [rows],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Costs</h1>
          <p className={styles.subtitle}>
            Token usage and estimated cost from completed AI exchanges (loaded at bootstrap).
          </p>
        </div>
        <label className={styles.filterLabel}>
          Period
          <select
            className={styles.select}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {DAY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className={styles.metrics}>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>Total cost</p>
          <p className={styles.metricValue}>{formatCents(Math.round(totalCostCents))}</p>
        </div>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>Exchanges</p>
          <p className={styles.metricValue}>{rows.length}</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Source</th>
              <th className={styles.th}>Label</th>
              <th className={styles.th}>Model</th>
              <th className={styles.thRight}>In</th>
              <th className={styles.thRight}>Out</th>
              <th className={styles.thRight}>Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  No completed AI exchanges in this period. Run slug, category, or recurring
                  detection after applying migrations 007–008.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.logicalKey}-${row.id}`} className={styles.tr}>
                  <td className={styles.td}>{formatDateTime(row.createdAt)}</td>
                  <td className={styles.td}>{formatSource(row.logicalKey)}</td>
                  <td className={styles.td}>{row.label}</td>
                  <td className={styles.tdMono}>{row.modelUsed || '—'}</td>
                  <td className={styles.tdRight}>{row.inputTokens.toLocaleString()}</td>
                  <td className={styles.tdRight}>{row.outputTokens.toLocaleString()}</td>
                  <td className={styles.tdRight}>{formatCents(Math.round(row.costCents))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: `p-6 max-w-6xl`,
  header: `flex flex-wrap items-start justify-between gap-4 mb-6`,
  title: `text-xl font-semibold text-gray-900`,
  subtitle: `mt-1 text-sm text-gray-600`,
  filterLabel: `flex flex-col gap-1 text-xs font-medium text-gray-600`,
  select: `rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900`,
  metrics: `grid grid-cols-2 gap-4 mb-6 max-w-md`,
  metricCard: `rounded-lg border border-gray-200 bg-white px-4 py-3`,
  metricLabel: `text-xs font-medium uppercase tracking-wide text-gray-500`,
  metricValue: `mt-1 text-lg font-semibold text-gray-900`,
  tableWrap: `overflow-x-auto rounded-lg border border-gray-200 bg-white`,
  table: `min-w-full text-sm`,
  th: `px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-50`,
  thRight: `px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-50`,
  tr: `border-t border-gray-100`,
  td: `px-4 py-2 text-gray-800`,
  tdMono: `px-4 py-2 text-gray-600 font-mono text-xs`,
  tdRight: `px-4 py-2 text-right text-gray-800 tabular-nums`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
