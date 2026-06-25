import type { RecurringPurchaseStatus } from '@/model/recurring-purchase';

export type RecurringPurchaseEventType = 'status_change' | 'next_due_change';

export type RecurringPurchaseEvent = {
  id: string;
  recurring_purchase_id: string;
  event_type: RecurringPurchaseEventType;
  status: RecurringPurchaseStatus | null;
  pause_days: number | null;
  paused_until: string | null;
  previous_next_due_at: string | null;
  next_due_at: string | null;
  notes: string | null;
  effective_at: string;
  created_at: string;
};
