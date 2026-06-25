import type { RecurringPurchase, RecurringPurchaseStatus } from '@/model/recurring-purchase';

/**
 * Resolves recurring purchase status with fallback for legacy rows.
 */
export const resolveRecurringPurchaseStatus = (
  purchase: RecurringPurchase,
): RecurringPurchaseStatus => purchase.status ?? (purchase.is_active ? 'active' : 'paused');
