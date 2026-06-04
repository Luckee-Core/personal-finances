'use client';

import { useMemo, useState } from 'react';
import type { LoanVendor } from '@/model/loan-vendor';
import { deleteLoanVendorThunk } from '@/store/thunks/loan-vendors/delete-loan-vendor-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Props = {
  onEdit: (vendor: LoanVendor) => void;
};

export const LoanVendorsTable = ({ onEdit }: Props) => {
  const dispatch = useAppDispatch();
  const vendors = useAppSelector((state) => Object.values(state.loanVendors));
  const loans = useAppSelector((state) => Object.values(state.loans));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loanCountByVendorId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const loan of loans) {
      if (!loan.loan_vendor_id) continue;
      counts[loan.loan_vendor_id] = (counts[loan.loan_vendor_id] ?? 0) + 1;
    }
    return counts;
  }, [loans]);

  const sorted = useMemo(
    () => [...vendors].sort((a, b) => a.name.localeCompare(b.name)),
    [vendors],
  );

  const handleDelete = async (vendor: LoanVendor) => {
    const count = loanCountByVendorId[vendor.id] ?? 0;
    const warning =
      count > 0
        ? `Delete "${vendor.name}"? ${count} loan${count === 1 ? '' : 's'} will lose their lender link.`
        : `Delete lender "${vendor.name}"?`;
    if (!window.confirm(warning)) return;

    setActionError(null);
    setBusyId(vendor.id);
    const result = await dispatch(deleteLoanVendorThunk(vendor.id));
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
            <th className={styles.thRight}>Loans</th>
            <th className={styles.thActions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.td}>{row.name}</td>
              <td className={styles.tdRight}>{loanCountByVendorId[row.id] ?? 0}</td>
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
          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.empty}>
                No lenders yet. Add one to use on loans.
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
  thRight: `px-4 py-2 font-medium text-right`,
  thActions: `px-4 py-2 font-medium text-right`,
  row: `border-t border-gray-100`,
  td: `px-4 py-2 align-top`,
  tdRight: `px-4 py-2 text-right align-top`,
  tdActions: `px-4 py-2 text-right align-top`,
  actions: `flex justify-end gap-2`,
  linkButton: `text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50`,
  dangerButton: `text-sm text-red-600 hover:text-red-800 disabled:opacity-50`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
