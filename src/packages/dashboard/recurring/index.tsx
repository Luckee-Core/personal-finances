'use client';

import { useMemo } from 'react';
import { getDashboardTimePeriodLabel } from '@/model/dashboard/time-period';
import { useAppSelector } from '@/store/hooks';
import { recurringOverlapsPeriod } from '@/utils/dashboard/recurring-overlaps-period';
import { resolveDashboardDateRange } from '@/utils/dashboard/resolve-dashboard-date-range';
import { formatCents } from '@/utils/format-cents';

export const DashboardRecurringTotalCard = () => {
  const recurring = useAppSelector((state) => Object.values(state.recurringPurchases));
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);

  const activeRecurringCents = useMemo(() => {
    const range = resolveDashboardDateRange(timePeriod);
    return recurring
      .filter((r) => recurringOverlapsPeriod(r, range))
      .reduce((sum, r) => sum + r.amount_cents, 0);
  }, [recurring, timePeriod]);

  const periodLabel = getDashboardTimePeriodLabel(timePeriod);

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Active recurring total</p>
      <p className={styles.cardPeriod}>{periodLabel}</p>
      <p className={styles.cardValue}>{formatCents(activeRecurringCents)}</p>
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
