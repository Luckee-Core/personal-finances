'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { sumForwardMonthlyBudget } from '@/utils/dashboard';
import { formatCents } from '@/utils/format-cents';

export const DashboardForwardMonthlyCard = () => {
  const recurring = useAppSelector((state) => Object.values(state.recurringPurchases));
  const anticipated = useAppSelector((state) => Object.values(state.anticipatedCosts));
  const loans = useAppSelector((state) => Object.values(state.loans));

  const budget = useMemo(
    () => sumForwardMonthlyBudget(recurring, anticipated, loans),
    [recurring, anticipated, loans],
  );

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Average monthly (going forward)</p>
      <p className={styles.cardValue}>{formatCents(budget.totalCents)}</p>
      <dl className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownTerm}>Recurring</dt>
          <dd className={styles.breakdownDetail}>
            {formatCents(budget.recurringCents)}
            <span className={styles.breakdownMeta}>
              ({budget.activeRecurringCount} active)
            </span>
          </dd>
        </div>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownTerm}>Anticipated</dt>
          <dd className={styles.breakdownDetail}>
            {formatCents(budget.anticipatedCents)}
            <span className={styles.breakdownMeta}>
              ({budget.anticipatedScheduledCount} scheduled)
            </span>
          </dd>
        </div>
        <div className={styles.breakdownRow}>
          <dt className={styles.breakdownTerm}>Loans</dt>
          <dd className={styles.breakdownDetail}>
            {formatCents(budget.loansCents)}
            <span className={styles.breakdownMeta}>({budget.activeLoanCount} active)</span>
          </dd>
        </div>
      </dl>
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
  cardValue: `
    mt-1 text-2xl font-semibold text-gray-900
  `,
  breakdown: `
    mt-4 space-y-2 border-t border-gray-100 pt-3
  `,
  breakdownRow: `
    flex items-baseline justify-between gap-3 text-sm
  `,
  breakdownTerm: `
    text-gray-600
  `,
  breakdownDetail: `
    font-medium text-gray-900 text-right
  `,
  breakdownMeta: `
    ml-1 font-normal text-gray-500
  `,
} as const;
