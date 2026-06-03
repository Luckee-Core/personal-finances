import type { DashboardDateRange } from '@/model/dashboard/time-period';
import type { RecurringPurchase } from '@/model/recurring-purchase';

export const recurringOverlapsPeriod = (
  purchase: RecurringPurchase,
  range: DashboardDateRange,
): boolean => {
  const startedOn = purchase.started_at.slice(0, 10);
  const endsOn = purchase.ends_at?.slice(0, 10);
  if (startedOn > range.end) return false;
  if (endsOn && endsOn < range.start) return false;
  return purchase.is_active;
};
