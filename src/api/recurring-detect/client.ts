import { getApiClient } from '@/api/client';
import type { ApiResponse } from '@/api/types';
import { fromCaughtError, fromExpressBody } from '@/api/_shared/express-response';
import type { RecurringDetectAiExchange } from '@/model/recurring-detect-ai-exchange';
import type { RecurringPurchase } from '@/model/recurring-purchase';

export type DetectRecurringChargeResult = {
  slug: string;
  suggested_name: string;
  billing_interval: string;
  typical_amount_cents: number;
  amount_min_cents: number | null;
  amount_max_cents: number | null;
  transaction_ids: string[];
  recurring_purchase_id: string | null;
  recurring_purchase: RecurringPurchase | null;
  confidence: string;
  reason: string;
};

export type DetectRecurringAllResult = {
  transaction_count: number;
  recurring_found: number;
  recurring_purchases_created: number;
  results: DetectRecurringChargeResult[];
  audit: {
    exchange: RecurringDetectAiExchange;
    request: { id: string };
    response: { id: string } | null;
  } | null;
};

type DetectBody = {
  success: boolean;
  data?: DetectRecurringAllResult;
  error?: string;
};

/**
 * Detects recurring purchases in one AI pass over all slugged transactions.
 */
export const detectRecurringPurchases = async (input: {
  slugs?: string[];
  min_transactions?: number;
  only_unlinked?: boolean;
  create_recurring?: boolean;
}): Promise<ApiResponse<DetectRecurringAllResult>> => {
  try {
    const { data } = await getApiClient().post<DetectBody>('/api/ai/recurring/detect', input);
    return fromExpressBody(data, 'Failed to detect recurring purchases');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to detect recurring purchases');
  }
};
