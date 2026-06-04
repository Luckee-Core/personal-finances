'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { sumPlannedAnticipatedMonthlyBudget } from '@/utils/anticipated/estimate-planned-monthly-cents';
import { formatCents } from '@/utils/format-cents';

export const AnticipatedCostsMonthSummary = () => {
  const costs = useAppSelector((state) => Object.values(state.anticipatedCosts));

  const { totalCents, scheduledItemCount } = useMemo(
    () => sumPlannedAnticipatedMonthlyBudget(costs),
    [costs],
  );

  const metaLabel =
    scheduledItemCount === 1
      ? '1 scheduled cost in this total'
      : `${scheduledItemCount} scheduled costs in this total`;

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Monthly total</p>
      <p className={styles.cardValue}>{formatCents(totalCents)}</p>
      <p className={styles.cardMeta}>{metaLabel}</p>
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
  cardMeta: `
    mt-1 text-sm text-gray-500
  `,
} as const;
