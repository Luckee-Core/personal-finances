import type { RecurringPurchase } from '@/model/recurring-purchase';

/**
 * Average monthly cents for one recurring purchase (0 when inactive).
 */
export const estimateRecurringMonthlyCents = (purchase: RecurringPurchase): number => {
  if (!purchase.is_active) {
    return 0;
  }

  const amount = purchase.amount_cents;

  switch (purchase.billing_interval) {
    case 'daily':
      return Math.round((amount * 365) / 12);
    case 'weekly':
      return Math.round((amount * 52) / 12);
    case 'monthly':
      return amount;
    case 'yearly':
      return Math.round(amount / 12);
    case 'custom': {
      const months = Math.max(1, purchase.interval_months ?? 1);
      return Math.round(amount / months);
    }
    default:
      return 0;
  }
};
