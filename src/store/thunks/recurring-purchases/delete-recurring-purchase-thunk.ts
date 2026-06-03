import { deleteRecurringPurchase } from '@/api/recurring-purchases';
import { RecurringPurchasesActions } from '@/store/dumps';
import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Deletes a recurring purchase and clears current selection.
 */
export const deleteRecurringPurchaseThunk =
  (id: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await deleteRecurringPurchase(id);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(RecurringPurchasesActions.removeRecurringPurchase(id));
    dispatch(CurrentRecurringPurchaseActions.clearCurrentRecurringPurchase());
    return 200;
  };
