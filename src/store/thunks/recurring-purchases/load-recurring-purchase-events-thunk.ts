import { getRecurringPurchaseEvents } from '@/api/recurring-purchases';
import { RecurringPurchaseEventsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Loads recurring purchase history events for a purchase into the dump.
 */
export const loadRecurringPurchaseEventsThunk =
  (purchaseId: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await getRecurringPurchaseEvents(purchaseId);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    dispatch(RecurringPurchaseEventsActions.clearRecurringPurchaseEventsForPurchase(purchaseId));
    dispatch(
      RecurringPurchaseEventsActions.upsertRecurringPurchaseEvents(result.data),
    );
    return { status: 200 };
  };
