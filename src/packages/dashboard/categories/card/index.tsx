'use client';

import { useMemo } from 'react';
import { toDashboardCategoryFilterValue } from '@/model/dashboard/category-filter';
import { DashboardBuilderActions } from '@/store/builders';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  isDateInDashboardRange,
  resolveDashboardDateRange,
} from '@/utils/dashboard';
import { transactionSpendCents } from '@/utils/dashboard';
import { formatCents } from '@/utils/format-cents';

type Props = {
  categoryId: string | null;
};

export const DashboardCategoryCard = ({ categoryId }: Props) => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => Object.values(state.transactions));
  const categories = useAppSelector((state) => state.categories);
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);
  const filteredCategory = useAppSelector((state) => state.dashboardBuilder.filteredCategory);
  const filterValue = toDashboardCategoryFilterValue(categoryId);
  const isSelected = filteredCategory === filterValue;

  const category = categoryId ? categories[categoryId] : null;

  const { spendCents, transactionCount } = useMemo(() => {
    const range = resolveDashboardDateRange(timePeriod);
    let spendCents = 0;
    let transactionCount = 0;

    for (const transaction of transactions) {
      if (transaction.category_id !== categoryId) continue;
      if (!isDateInDashboardRange(transaction.posted_on, range)) continue;

      const spend = transactionSpendCents(transaction);
      if (spend === 0) continue;

      spendCents += spend;
      transactionCount += 1;
    }

    return { spendCents, transactionCount };
  }, [transactions, categoryId, timePeriod]);

  const name = category?.name ?? 'Uncategorized';
  const color = category?.color ?? null;

  const handleClick = () => {
    dispatch(
      DashboardBuilderActions.setFilteredCategory(isSelected ? null : filterValue),
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
    >
      <div className={styles.cardHeader}>
        <span
          className={styles.colorDot}
          style={{ backgroundColor: color ?? '#d1d5db' }}
          aria-hidden
        />
        <p className={styles.cardLabel}>{name}</p>
      </div>
      <p className={styles.cardValue}>{formatCents(spendCents)}</p>
      <p className={styles.cardMeta}>
        {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
      </p>
    </button>
  );
};

const styles = {
  card: `
    w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-left
    hover:border-gray-300 hover:bg-gray-50
  `,
  cardSelected: `
    border-gray-900 ring-1 ring-gray-900 bg-gray-50
  `,
  cardHeader: `
    flex items-center gap-1.5 min-w-0
  `,
  colorDot: `
    h-2 w-2 shrink-0 rounded-full
  `,
  cardLabel: `
    truncate text-xs font-medium text-gray-700
  `,
  cardValue: `
    mt-1 text-lg font-semibold text-gray-900
  `,
  cardMeta: `
    text-[11px] leading-tight text-gray-500
  `,
} as const;
