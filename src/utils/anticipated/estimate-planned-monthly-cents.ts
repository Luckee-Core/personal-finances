import type { AnticipatedCost } from '@/model/anticipated-cost';

/**
 * Average monthly cents for one planned cost on a schedule (0 for one-time / non-planned).
 */
export const estimatePlannedMonthlyCents = (cost: AnticipatedCost): number => {
  if (cost.status !== 'planned' || cost.timeframe_interval == null) {
    return 0;
  }

  const amount = cost.amount_cents;
  const every = Math.max(1, cost.timeframe_every ?? 1);

  switch (cost.timeframe_interval) {
    case 'weekly':
      return Math.round((amount * 52) / (12 * every));
    case 'monthly':
      return Math.round(amount / every);
    case 'yearly':
      return Math.round(amount / (12 * every));
    default:
      return 0;
  }
};

export type PlannedAnticipatedMonthlyBudget = {
  totalCents: number;
  scheduledItemCount: number;
};

/**
 * Sums planned scheduled costs as an average monthly budget (excludes one-time items).
 */
export const sumPlannedAnticipatedMonthlyBudget = (
  costs: AnticipatedCost[],
): PlannedAnticipatedMonthlyBudget => {
  let totalCents = 0;
  let scheduledItemCount = 0;

  for (const cost of costs) {
    const monthlyCents = estimatePlannedMonthlyCents(cost);
    if (monthlyCents <= 0) continue;
    totalCents += monthlyCents;
    scheduledItemCount += 1;
  }

  return { totalCents, scheduledItemCount };
};
