export type AnticipatedCostStatus = 'planned' | 'completed' | 'cancelled';

export const ANTICIPATED_COST_STATUS_OPTIONS: AnticipatedCostStatus[] = [
  'planned',
  'completed',
  'cancelled',
];

export type AnticipatedTimeframeInterval = 'weekly' | 'monthly' | 'yearly';

export const ANTICIPATED_TIMEFRAME_INTERVAL_OPTIONS: AnticipatedTimeframeInterval[] = [
  'weekly',
  'monthly',
  'yearly',
];

export const MIN_ANTICIPATED_TIMEFRAME_COUNT = 1;
export const MAX_ANTICIPATED_TIMEFRAME_COUNT = 600;
export const MIN_ANTICIPATED_TIMEFRAME_EVERY = 1;
export const MAX_ANTICIPATED_TIMEFRAME_EVERY = 52;

export type AnticipatedCost = {
  id: string;
  name: string;
  amount_cents: number;
  due_on: string;
  category_id: string | null;
  notes: string | null;
  timeframe_interval: AnticipatedTimeframeInterval | null;
  /** Every N weeks/months/years when scheduled (default 1). */
  timeframe_every: number | null;
  timeframe_count: number | null;
  status: AnticipatedCostStatus;
  created_at: string;
  updated_at: string;
};
