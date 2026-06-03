'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTION_DETAIL_PATH } from '@/config/routes';
import type { Transaction } from '@/model/transaction';
import { setCurrentTransactionThunk } from '@/store/thunks/transactions/set-current-transaction-thunk';
import { assignTransactionSlugThunk } from '@/store/thunks/transactions/assign-transaction-slug-thunk';
import { RecategorizeFlowModal } from '@/packages/transactions/recategorize-flow-modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';

type SortKey = 'posted_on' | 'slug';
type SortDir = 'asc' | 'desc';

const compareSlug = (a: Transaction, b: Transaction, dir: SortDir): number => {
  const slugA = a.slug ?? '';
  const slugB = b.slug ?? '';
  const hasA = slugA.length > 0;
  const hasB = slugB.length > 0;
  if (hasA !== hasB) {
    return dir === 'asc' ? (hasA ? -1 : 1) : hasA ? 1 : -1;
  }
  const cmp = slugA.localeCompare(slugB);
  return dir === 'asc' ? cmp : -cmp;
};

export const TransactionsTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const transactions = useAppSelector((state) => Object.values(state.transactions));
  const categories = useAppSelector((state) => state.categories);
  const [assigningSlugId, setAssigningSlugId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [recategorizeTarget, setRecategorizeTarget] = useState<Transaction | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('posted_on');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir(key === 'slug' ? 'asc' : 'desc');
  };

  const sorted = [...transactions].sort((a, b) => {
    if (sortKey === 'slug') {
      return compareSlug(a, b, sortDir);
    }
    const cmp = a.posted_on.localeCompare(b.posted_on);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const openDetail = (row: Transaction) => {
    dispatch(setCurrentTransactionThunk(row));
    router.push(TRANSACTION_DETAIL_PATH);
  };

  const handleAssignSlug = async (row: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setRowError(null);
    setAssigningSlugId(row.id);
    const result = await dispatch(
      assignTransactionSlugThunk(row.id, { force: Boolean(row.slug) }),
    );
    setAssigningSlugId(null);
    if (result.status !== 200) {
      setRowError(result.message);
    }
  };

  const openRecategorize = (row: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setRowError(null);
    setRecategorizeTarget(row);
  };

  return (
    <div className={styles.wrapper}>
      {rowError && <p className={styles.bannerError}>{rowError}</p>}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>
              <button type="button" className={styles.sortButton} onClick={() => toggleSort('posted_on')}>
                Date{sortIndicator('posted_on')}
              </button>
            </th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Source</th>
            <th className={styles.th}>
              <button type="button" className={styles.sortButton} onClick={() => toggleSort('slug')}>
                Slug{sortIndicator('slug')}
              </button>
            </th>
            <th className={`${styles.th} text-right`}>Amount</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.clickableRow} onClick={() => openDetail(row)}>
              <td className={styles.td}>{row.posted_on}</td>
              <td className={styles.td}>{row.description}</td>
              <td className={styles.td}>
                {row.category_id ? categories[row.category_id]?.name ?? '—' : '—'}
              </td>
              <td className={`${styles.td} capitalize`}>{row.source}</td>
              <td className={`${styles.td} ${styles.slugCell}`}>
                {row.slug ?? '—'}
              </td>
              <td className={`${styles.td} text-right`}>{formatCents(row.amount_cents)}</td>
              <td className={styles.td}>
                <div className={styles.actionGroup}>
                  <button
                    type="button"
                    className={styles.actionButton}
                    disabled={assigningSlugId === row.id}
                    onClick={(e) => openRecategorize(row, e)}
                  >
                    {row.category_id ? 'Re-categorize' : 'Category'}
                  </button>
                  <button
                    type="button"
                    className={styles.actionButton}
                    disabled={assigningSlugId === row.id}
                    onClick={(e) => void handleAssignSlug(row, e)}
                  >
                    {assigningSlugId === row.id
                      ? '…'
                      : row.slug
                        ? 'Re-slug'
                        : 'Slug'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.empty}>
                No transactions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {recategorizeTarget && (
        <RecategorizeFlowModal
          isOpen
          onClose={() => setRecategorizeTarget(null)}
          transactionIds={[recategorizeTarget.id]}
          scopeLabel={recategorizeTarget.description}
          onComplete={(_message, error) => {
            if (error) setRowError(error);
            setRecategorizeTarget(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  wrapper: `
    overflow-hidden rounded-lg border border-gray-200 bg-white
  `,
  bannerError: `
    px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-100
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
  sortButton: `
    -mx-1 rounded px-1 py-0.5 text-left font-medium text-gray-600
    hover:bg-gray-200 hover:text-gray-900
  `,
  clickableRow: `
    border-t border-gray-100 hover:bg-gray-50 cursor-pointer
  `,
  td: `
    px-4 py-2
  `,
  slugCell: `
    font-mono text-xs text-gray-600
  `,
  actionGroup: `
    flex flex-wrap gap-1
  `,
  actionButton: `
    rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-800
    hover:bg-gray-100 disabled:opacity-50
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
