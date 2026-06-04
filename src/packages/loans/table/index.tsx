'use client';

import { useMemo, useState } from 'react';
import type { Loan } from '@/model/loan';
import { deleteLoanThunk } from '@/store/thunks/loans/delete-loan-thunk';
import { updateLoanThunk } from '@/store/thunks/loans/update-loan-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import { getLoanVendorName } from '@/utils/loans';
import { sumActiveLoanMonthlyCents } from '@/utils/loans';

type Props = {
  hideInactive: boolean;
  onEdit: (loan: Loan) => void;
};

export const LoansTable = ({ hideInactive, onEdit }: Props) => {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((state) => Object.values(state.loans));
  const vendorsById = useAppSelector((state) => state.loanVendors);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const visibleRows = useMemo(() => {
    const filtered = hideInactive ? rows.filter((row) => row.is_active) : rows;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, hideInactive]);

  const { totalCents: monthlyTotalCents, totalBalanceCents } = useMemo(
    () => sumActiveLoanMonthlyCents(visibleRows.filter((r) => r.is_active)),
    [visibleRows],
  );

  const handleActiveChange = async (row: Loan, value: string) => {
    const nextActive = value === 'yes';
    if (nextActive === row.is_active) return;
    setActionError(null);
    setBusyId(row.id);
    const result = await dispatch(updateLoanThunk(row.id, { is_active: nextActive }));
    setBusyId(null);
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to update');
    }
  };

  const handleDelete = async (row: Loan) => {
    if (!window.confirm(`Delete loan "${row.name}"?`)) return;
    setActionError(null);
    setBusyId(row.id);
    const result = await dispatch(deleteLoanThunk(row.id));
    setBusyId(null);
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to delete');
    }
  };

  return (
    <div className={styles.wrapper}>
      {actionError && <p className={styles.error}>{actionError}</p>}
      <div className={styles.summaryRow}>
        <span>
          Active monthly payments: <strong>{formatCents(monthlyTotalCents)}</strong>
        </span>
        <span>
          Balance (active): <strong>{formatCents(totalBalanceCents)}</strong>
        </span>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Vendor</th>
            <th className={styles.thRight}>Balance</th>
            <th className={styles.thRight}>Monthly payment</th>
            <th className={styles.th}>Active</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.td}>
                <span className={styles.name}>{row.name}</span>
              </td>
              <td className={styles.td}>{getLoanVendorName(row, vendorsById)}</td>
              <td className={styles.tdRight}>{formatCents(row.balance_cents)}</td>
              <td className={styles.tdRight}>{formatCents(row.monthly_payment_cents)}</td>
              <td className={styles.td}>
                <select
                  className={styles.select}
                  value={row.is_active ? 'yes' : 'no'}
                  disabled={busyId === row.id}
                  onChange={(e) => void handleActiveChange(row, e.target.value)}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
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
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.empty}>
                {hideInactive ? 'No active loans.' : 'No loans yet.'}
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
  summaryRow: `
    flex flex-wrap gap-4 text-sm text-gray-600
  `,
  table: `
    min-w-full overflow-x-auto rounded-lg border border-gray-200 bg-white text-sm
  `,
  thead: `bg-gray-50 text-left text-gray-600`,
  th: `px-4 py-2 font-medium`,
  thRight: `px-4 py-2 font-medium text-right`,
  thActions: `px-4 py-2 font-medium text-right`,
  row: `border-t border-gray-100`,
  td: `px-4 py-2 align-top`,
  tdRight: `px-4 py-2 text-right align-top`,
  tdActions: `px-4 py-2 text-right align-top`,
  name: `font-medium text-gray-900`,
  select: `rounded-md border border-gray-300 bg-white px-2 py-1 text-sm`,
  actions: `flex justify-end gap-2`,
  linkButton: `text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50`,
  dangerButton: `text-sm text-red-600 hover:text-red-800 disabled:opacity-50`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
