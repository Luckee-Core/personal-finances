'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RECURRING_PURCHASE_DETAIL_PATH } from '@/config/routes';
import type { RecurringPurchase, RecurringPurchaseStatus } from '@/model/recurring-purchase';
import { TransactionRowActionsMenu } from '@/components/transaction-row-actions-menu';
import { PauseStatusModal } from '@/packages/recurring-purchases/pause-status-modal';
import {
  changeRecurringPurchaseStatusThunk,
  deleteRecurringPurchaseThunk,
  markNotRecurringThunk,
  setCurrentRecurringPurchaseThunk,
} from '@/store/thunks/recurring-purchases';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import {
  getRecurringPurchaseStatusLabel,
  resolveRecurringPurchaseStatus,
} from '@/utils/recurring';

type Props = {
  onEdit: (purchase: RecurringPurchase) => void;
};

export const RecurringPurchasesTable = ({ onEdit }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rows = useAppSelector((state) => Object.values(state.recurringPurchases));
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<'delete' | 'not_recurring' | null>(null);
  const [savingStatusId, setSavingStatusId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pausePurchase, setPausePurchase] = useState<RecurringPurchase | null>(null);
  const [statusSelectValues, setStatusSelectValues] = useState<Record<string, RecurringPurchaseStatus>>(
    {},
  );

  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  const openDetail = (row: RecurringPurchase) => {
    dispatch(setCurrentRecurringPurchaseThunk(row));
    router.push(RECURRING_PURCHASE_DETAIL_PATH);
  };

  const toggleMenu = (purchaseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((current) => (current === purchaseId ? null : purchaseId));
  };

  const handleEdit = (row: RecurringPurchase) => {
    closeMenu();
    onEdit(row);
  };

  const handleNotRecurring = async (row: RecurringPurchase) => {
    closeMenu();
    const slug = row.vendor?.trim() || 'this merchant';
    if (
      !window.confirm(
        `Mark "${row.name}" as not recurring?\n\nThis deletes the recurring purchase and excludes slug "${slug}" from AI detect.`,
      )
    ) {
      return;
    }
    setActionError(null);
    setBusyId(row.id);
    setBusyAction('not_recurring');
    const result = await dispatch(markNotRecurringThunk(row.id));
    setBusyId(null);
    setBusyAction(null);
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to mark as not recurring');
    }
  };

  const applyStatusChange = async (row: RecurringPurchase, status: RecurringPurchaseStatus) => {
    setActionError(null);
    setSavingStatusId(row.id);
    const result = await dispatch(
      changeRecurringPurchaseStatusThunk(row.id, {
        status,
      }),
    );
    setSavingStatusId(null);
    setStatusSelectValues((current) => {
      const next = { ...current };
      delete next[row.id];
      return next;
    });
    if (result.status !== 200) {
      setActionError(result.message ?? 'Failed to update status');
    }
  };

  const handleStatusChange = async (row: RecurringPurchase, value: string) => {
    const status = value as RecurringPurchaseStatus;
    const currentStatus = resolveRecurringPurchaseStatus(row);
    if (status === currentStatus) return;

    if (status === 'paused') {
      setStatusSelectValues((current) => ({ ...current, [row.id]: 'paused' }));
      setPausePurchase(row);
      return;
    }

    await applyStatusChange(row, status);
  };

  const handlePauseClose = (row: RecurringPurchase) => {
    setPausePurchase(null);
    setStatusSelectValues((current) => {
      const next = { ...current };
      delete next[row.id];
      return next;
    });
  };

  const handleDelete = async (row: RecurringPurchase) => {
    closeMenu();
    if (!window.confirm(`Delete recurring purchase "${row.name}"?`)) {
      return;
    }
    setActionError(null);
    setBusyId(row.id);
    setBusyAction('delete');
    const result = await dispatch(deleteRecurringPurchaseThunk(row.id));
    setBusyId(null);
    setBusyAction(null);
    if (result.status !== 200) {
      setActionError('Failed to delete recurring purchase');
    }
  };

  return (
    <div className={styles.wrapper}>
      {actionError && <p className={styles.actionError}>{actionError}</p>}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Interval</th>
            <th className={styles.th}>Status</th>
            <th className={`${styles.th} text-right`}>Amount</th>
            <th className={styles.thActions} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = resolveRecurringPurchaseStatus(row);
            const selectValue = statusSelectValues[row.id] ?? status;
            return (
              <tr key={row.id} className={styles.clickableRow} onClick={() => openDetail(row)}>
                <td className={styles.td}>{row.name}</td>
                <td className={`${styles.td} capitalize`}>{row.billing_interval}</td>
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <select
                    className={styles.statusSelect}
                    value={selectValue}
                    disabled={savingStatusId === row.id}
                    aria-label={`Status for ${row.name}`}
                    onChange={(e) => void handleStatusChange(row, e.target.value)}
                  >
                    <option value="active">{getRecurringPurchaseStatusLabel('active')}</option>
                    <option value="paused">{getRecurringPurchaseStatusLabel('paused')}</option>
                    <option value="cancelled">{getRecurringPurchaseStatusLabel('cancelled')}</option>
                  </select>
                  {status === 'paused' && row.paused_until && (
                    <p className={styles.pausedUntil}>Until {row.paused_until.slice(0, 10)}</p>
                  )}
                </td>
                <td className={`${styles.td} text-right`}>{formatCents(row.amount_cents)}</td>
                <td className={styles.tdActions} onClick={(e) => e.stopPropagation()}>
                  <TransactionRowActionsMenu
                    isOpen={openMenuId === row.id}
                    isDeleting={busyId === row.id}
                    busyLabel={busyAction === 'not_recurring' ? 'Saving…' : 'Deleting…'}
                    triggerAriaLabel="Recurring purchase actions"
                    onClose={closeMenu}
                    onToggle={(e) => toggleMenu(row.id, e)}
                    onEdit={() => handleEdit(row)}
                    onNotRecurring={() => void handleNotRecurring(row)}
                    onDelete={() => void handleDelete(row)}
                  />
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No recurring purchases yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PauseStatusModal
        isOpen={pausePurchase !== null}
        purchase={pausePurchase}
        onClose={() => {
          if (pausePurchase) handlePauseClose(pausePurchase);
        }}
      />
    </div>
  );
};

const styles = {
  wrapper: `
    space-y-2
  `,
  actionError: `
    text-sm text-red-600
  `,
  table: `
    min-w-full text-sm
  `,
  thead: `
    bg-gray-50 text-left text-gray-600
  `,
  th: `
    px-4 py-2 font-medium
  `,
  thActions: `
    w-10 px-2 py-2
  `,
  clickableRow: `
    border-t border-gray-100 hover:bg-gray-50 cursor-pointer
  `,
  td: `
    px-4 py-2
  `,
  statusSelect: `
    rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900
    disabled:opacity-50
  `,
  pausedUntil: `
    mt-1 text-xs text-gray-500
  `,
  tdActions: `
    w-10 px-2 py-2 text-right
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
