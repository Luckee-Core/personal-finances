'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTION_DETAIL_PATH } from '@/config/routes';
import type { Transaction } from '@/model/transaction';
import { TransactionCategoryCombobox } from '@/packages/categories';
import { TransactionRowActionsMenu } from '@/components/transaction-row-actions-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteTransactionThunk,
  setCurrentTransactionThunk,
} from '@/store/thunks/transactions';
import { formatCents } from '@/utils/format-cents';

type ImportTransactionsTableProps = {
  transactions: Transaction[];
};

export const ImportTransactionsTable = ({ transactions }: ImportTransactionsTableProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.posted_on.localeCompare(a.posted_on)),
    [transactions],
  );

  const openDetail = (row: Transaction) => {
    dispatch(setCurrentTransactionThunk(row));
    router.push(TRANSACTION_DETAIL_PATH);
  };

  const toggleMenu = (transactionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((current) => (current === transactionId ? null : transactionId));
  };

  const handleEdit = (row: Transaction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    closeMenu();
    openDetail(row);
  };

  const handleDelete = async (row: Transaction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    closeMenu();
    if (!window.confirm(`Delete this transaction?\n\n${row.description}`)) {
      return;
    }
    setActionError(null);
    setDeletingId(row.id);
    const result = await dispatch(deleteTransactionThunk(row.id));
    setDeletingId(null);
    if (result.status !== 200) {
      setActionError('Failed to delete transaction');
    }
  };

  return (
    <div className={styles.section}>
      {categoryError && <p className={styles.error}>{categoryError}</p>}
      {actionError && <p className={styles.error}>{actionError}</p>}
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Category</th>
              <th className={`${styles.th} text-right`}>Amount</th>
              <th className={styles.thActions} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                className={styles.clickableRow}
                onClick={() => openDetail(row)}
              >
                <td className={styles.td}>{row.posted_on}</td>
                <td className={styles.td}>{row.description}</td>
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <TransactionCategoryCombobox
                    transactionId={row.id}
                    categoryId={row.category_id}
                    usePortal
                    onError={(message) => setCategoryError(message)}
                  />
                </td>
                <td className={`${styles.td} text-right`}>{formatCents(row.amount_cents)}</td>
                <td className={styles.tdActions} onClick={(e) => e.stopPropagation()}>
                  <TransactionRowActionsMenu
                    isOpen={openMenuId === row.id}
                    isDeleting={deletingId === row.id}
                    onClose={closeMenu}
                    onToggle={(e) => toggleMenu(row.id, e)}
                    onEdit={() => handleEdit(row)}
                    onDelete={() => void handleDelete(row)}
                  />
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No transactions linked to this import.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  section: `
    space-y-2
  `,
  error: `
    text-sm text-red-600
  `,
  wrapper: `
    overflow-x-auto rounded-lg border border-gray-200 bg-white
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
    w-12 px-2 py-2
  `,
  clickableRow: `
    border-t border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b last:border-gray-100
  `,
  td: `
    px-4 py-2 align-top
  `,
  tdActions: `
    w-12 px-2 py-2 text-right align-top
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
