import {
  updateRecurringPurchase,
  type CreateRecurringPurchasePayload,
} from '@/api/recurring-purchases';
import { RecurringPurchasesActions } from '@/store/dumps';
import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates a recurring purchase via the API and upserts it into the dump.
 */
export const updateRecurringPurchaseThunk =
  (
    id: string,
    payload: Partial<CreateRecurringPurchasePayload>,
  ): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await updateRecurringPurchase(id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(RecurringPurchasesActions.upsertRecurringPurchase(result.data));
    if (getState().currentRecurringPurchase?.id === id) {
      dispatch(CurrentRecurringPurchaseActions.setCurrentRecurringPurchase(result.data));
    }
    return { status: 200 };
  };
