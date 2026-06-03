import { createRecurringPurchase, type CreateRecurringPurchasePayload } from '@/api/recurring-purchases';
import { RecurringPurchasesActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a recurring purchase via the API and upserts it into the dump.
 */
export const createRecurringPurchaseThunk =
  (payload: CreateRecurringPurchasePayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createRecurringPurchase(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(RecurringPurchasesActions.upsertRecurringPurchase(result.data));
    return { status: 200 };
  };
