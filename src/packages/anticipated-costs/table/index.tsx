'use client';

import { useState } from 'react';
import type { AnticipatedCost } from '@/model/anticipated-cost';
import {
  deleteAnticipatedCostThunk,
  updateAnticipatedCostThunk,
} from '@/store/thunks/anticipated-costs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import { formatAnticipatedTimeframeLabel } from '@/utils/anticipated';

type Props = {
  onEdit: (cost: AnticipatedCost) => void;
};

const statusLabel: Record<AnticipatedCost['status'], string> = {
  planned: 'Planned',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const AnticipatedCostsTable = ({ onEdit }: Props) => {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((state) => Object.values(state.anticipatedCosts));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sorted = [...rows].sort((a, b) => {
    const byDue = a.due_on.localeCompare(b.due_on);
    if (byDue !== 0) return byDue;
    return a.name.localeCompare(b.name);
  });

  const handleComplete = async (row: AnticipatedCost) => {
    setActionError(null);
    setBusyId(row.id);
    const result = await dispatch(
      updateAnticipatedCostThunk(row.id, { status: 'completed' }),
    );
    setBusyId(null);
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to mark completed');
    }
  };

  const handleDelete = async (row: AnticipatedCost) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    setActionError(null);
    setBusyId(row.id);
    const result = await dispatch(deleteAnticipatedCostThunk(row.id));
    setBusyId(null);
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to delete');
    }
  };

  return (
    <div className={styles.wrapper}>
      {actionError && <p className={styles.error}>{actionError}</p>}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Timeframe</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Status</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.td}>
                <span className={styles.name}>{row.name}</span>
                {row.notes && <span className={styles.notes}>{row.notes}</span>}
              </td>
              <td className={styles.td}>
                {formatAnticipatedTimeframeLabel(
                  row.due_on,
                  row.timeframe_interval,
                  row.timeframe_count,
                  row.timeframe_every,
                )}
              </td>
              <td className={styles.td}>{formatCents(row.amount_cents)}</td>
              <td className={styles.td}>
                <span className={styles.statusBadge}>{statusLabel[row.status]}</span>
              </td>
              <td className={styles.tdActions}>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => onEdit(row)}
                    disabled={busyId === row.id}
                  >
                    Edit
                  </button>
                  {row.status === 'planned' && (
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => void handleComplete(row)}
                      disabled={busyId === row.id}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => void handleDelete(row)}
                    disabled={busyId === row.id}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No anticipated costs yet. Add your lease, internet, phone, and other upcoming
                expenses.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrapper: `space-y-2`,
  error: `text-sm text-red-600`,
  table: `min-w-full overflow-x-auto rounded-lg border border-gray-200 bg-white text-sm`,
  thead: `bg-gray-50 text-left text-gray-600`,
  th: `px-4 py-2 font-medium`,
  thActions: `px-4 py-2 font-medium text-right`,
  row: `border-t border-gray-100`,
  td: `px-4 py-2 align-top`,
  tdActions: `px-4 py-2 text-right align-top`,
  name: `block font-medium text-gray-900`,
  notes: `block text-xs text-gray-500 mt-0.5`,
  statusBadge: `
    inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700
  `,
  actions: `flex flex-wrap justify-end gap-2`,
  linkButton: `text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50`,
  dangerButton: `text-sm text-red-600 hover:text-red-800 disabled:opacity-50`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
