export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export const BILLING_INTERVAL_OPTIONS: BillingInterval[] = [
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'custom',
];

export type RecurringPurchaseStatus = 'active' | 'paused' | 'cancelled';

export type RecurringPurchase = {
  id: string;
  name: string;
  vendor: string | null;
  amount_cents: number;
  billing_interval: BillingInterval;
  interval_months: number | null;
  currency: string;
  started_at: string;
  next_due_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  status: RecurringPurchaseStatus;
  paused_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
