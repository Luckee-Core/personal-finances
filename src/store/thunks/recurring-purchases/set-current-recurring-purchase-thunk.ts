import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Sets the current recurring purchase for detail navigation.
 */
export const setCurrentRecurringPurchaseThunk =
  (purchase: RecurringPurchase): AppThunk<ThunkStatus> =>
  (dispatch) => {
    dispatch(CurrentRecurringPurchaseActions.setCurrentRecurringPurchase(purchase));
    return 200;
  };
