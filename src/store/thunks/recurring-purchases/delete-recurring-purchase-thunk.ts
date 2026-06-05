import { deleteRecurringPurchase } from '@/api/recurring-purchases';
import { RecurringPurchasesActions } from '@/store/dumps';
import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes a recurring purchase and clears current selection.
 */
export const deleteRecurringPurchaseThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await deleteRecurringPurchase(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(RecurringPurchasesActions.removeRecurringPurchase(id));
    dispatch(CurrentRecurringPurchaseActions.clearCurrentRecurringPurchase());
    return { status: 200 };
  };
