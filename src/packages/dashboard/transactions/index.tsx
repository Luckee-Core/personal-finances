'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTION_DETAIL_PATH } from '@/config/routes';
import {
  DASHBOARD_UNCATEGORIZED_FILTER,
  matchesDashboardCategoryFilter,
} from '@/model/dashboard/category-filter';
import { getDashboardTimePeriodLabel } from '@/model/dashboard/time-period';
import { DashboardBuilderActions } from '@/store/builders';
import type { Transaction } from '@/model/transaction';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteTransactionThunk,
  setCurrentTransactionThunk,
} from '@/store/thunks/transactions';
import { TransactionCategoryCombobox } from '@/packages/categories';
import { TransactionRowActionsMenu } from '@/components/transaction-row-actions-menu';
import {
  isDateInDashboardRange,
  resolveDashboardDateRange,
} from '@/utils/dashboard';
import { formatCents } from '@/utils/format-cents';
import { RecategorizeFlowModal } from '@/packages/transactions/recategorize-flow-modal';

export const DashboardTransactionsSection = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const transactions = useAppSelector((state) => Object.values(state.transactions));
  const categories = useAppSelector((state) => state.categories);
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);
  const filteredCategory = useAppSelector((state) => state.dashboardBuilder.filteredCategory);
  const [recategorizeOpen, setRecategorizeOpen] = useState(false);
  const [batchInfo, setBatchInfo] = useState<string | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  const sorted = useMemo(() => {
    const range = resolveDashboardDateRange(timePeriod);
    return transactions
      .filter((t) => isDateInDashboardRange(t.posted_on, range))
      .filter((t) => matchesDashboardCategoryFilter(t.category_id, filteredCategory))
      .sort((a, b) => b.posted_on.localeCompare(a.posted_on));
  }, [transactions, timePeriod, filteredCategory]);

  const periodLabel = getDashboardTimePeriodLabel(timePeriod);

  const categoryFilterLabel =
    filteredCategory === null
      ? null
      : filteredCategory === DASHBOARD_UNCATEGORIZED_FILTER
        ? 'Uncategorized'
        : (categories[filteredCategory]?.name ?? 'Category');

  const clearCategoryFilter = () => {
    dispatch(DashboardBuilderActions.setFilteredCategory(null));
  };

  const recategorizeScopeLabel = `${periodLabel}${categoryFilterLabel ? ` · ${categoryFilterLabel}` : ''}`;
  const recategorizeIds = useMemo(() => sorted.map((t) => t.id), [sorted]);

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
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Transactions</h2>
          <p className={styles.subheading}>
            {periodLabel}
            {categoryFilterLabel ? ` · ${categoryFilterLabel}` : ''}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setRecategorizeOpen(true)}
            disabled={recategorizeIds.length === 0}
            className={styles.recategorizeButton}
          >
            Re-categorize
          </button>
          {filteredCategory !== null && (
            <button type="button" onClick={clearCategoryFilter} className={styles.clearButton}>
              Clear category
            </button>
          )}
        </div>
      </div>
      {batchError && <p className={styles.batchError}>{batchError}</p>}
      {categoryError && <p className={styles.batchError}>{categoryError}</p>}
      {actionError && <p className={styles.batchError}>{actionError}</p>}
      {batchInfo && <p className={styles.batchInfo}>{batchInfo}</p>}
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Source</th>
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
                <td className={`${styles.td} capitalize`}>{row.source}</td>
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
                <td colSpan={6} className={styles.empty}>
                  {filteredCategory !== null
                    ? 'No transactions for this category in this period.'
                    : 'No transactions in this period.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <RecategorizeFlowModal
        isOpen={recategorizeOpen}
        onClose={() => setRecategorizeOpen(false)}
        transactionIds={recategorizeIds}
        scopeLabel={recategorizeScopeLabel}
        onComplete={(message, error) => {
          setBatchInfo(message);
          setBatchError(error);
        }}
      />
    </section>
  );
};

const styles = {
  section: `
    space-y-3
  `,
  header: `
    flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between
  `,
  headerActions: `
    flex shrink-0 flex-wrap items-center gap-3
  `,
  recategorizeButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800
    hover:bg-gray-50 disabled:opacity-50
  `,
  clearButton: `
    text-sm text-gray-600 underline hover:text-gray-900
  `,
  batchError: `
    text-sm text-red-600
  `,
  batchInfo: `
    text-sm text-gray-600
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  subheading: `
    text-sm text-gray-500
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
  tdActions: `
    w-12 px-2 py-2 text-right
  `,
  clickableRow: `
    border-t border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b last:border-gray-100
  `,
  td: `
    px-4 py-2
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
