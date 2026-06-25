import type { RecurringPurchaseStatus } from '@/model/recurring-purchase';

/**
 * Returns a display label for a recurring purchase status.
 */
export const getRecurringPurchaseStatusLabel = (status: RecurringPurchaseStatus): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
