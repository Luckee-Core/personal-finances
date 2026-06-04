'use client';

import { useMemo } from 'react';
import { getDashboardTimePeriodLabel } from '@/model/dashboard/time-period';
import { useAppSelector } from '@/store/hooks';
import {
  isDateInDashboardRange,
  resolveDashboardDateRange,
} from '@/utils/dashboard';
import { transactionSpendCents } from '@/utils/dashboard';
import { formatCents } from '@/utils/format-cents';

export const DashboardMonthlySpendCard = () => {
  const transactions = useAppSelector((state) => Object.values(state.transactions));
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);

  const spendCents = useMemo(() => {
    const range = resolveDashboardDateRange(timePeriod);
    return transactions
      .filter((t) => isDateInDashboardRange(t.posted_on, range))
      .reduce((sum, t) => sum + transactionSpendCents(t), 0);
  }, [transactions, timePeriod]);

  const periodLabel = getDashboardTimePeriodLabel(timePeriod);

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Spend (debits)</p>
      <p className={styles.cardPeriod}>{periodLabel}</p>
      <p className={styles.cardValue}>{formatCents(spendCents)}</p>
    </div>
  );
};

const styles = {
  card: `
    rounded-lg border border-gray-200 bg-white p-5
  `,
  cardLabel: `
    text-sm text-gray-500
  `,
  cardPeriod: `
    text-xs text-gray-400
  `,
  cardValue: `
    mt-2 text-2xl font-semibold text-gray-900
  `,
} as const;
