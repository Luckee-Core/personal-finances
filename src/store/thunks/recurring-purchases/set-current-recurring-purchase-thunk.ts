import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Sets the current recurring purchase for detail navigation.
 */
export const setCurrentRecurringPurchaseThunk =
  (purchase: RecurringPurchase): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    dispatch(CurrentRecurringPurchaseActions.setCurrentRecurringPurchase(purchase));
    return { status: 200 };
  };
