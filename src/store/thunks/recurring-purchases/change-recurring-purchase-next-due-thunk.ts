import {
  changeRecurringPurchaseNextDue,
  type ChangeRecurringPurchaseNextDuePayload,
} from '@/api/recurring-purchases';
import { RecurringPurchaseEventsActions, RecurringPurchasesActions } from '@/store/dumps';
import { CurrentRecurringPurchaseActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Changes next payment date via the API and updates Redux state.
 */
export const changeRecurringPurchaseNextDueThunk =
  (
    id: string,
    payload: ChangeRecurringPurchaseNextDuePayload,
  ): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await changeRecurringPurchaseNextDue(id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    dispatch(RecurringPurchasesActions.upsertRecurringPurchase(result.data.purchase));
    dispatch(RecurringPurchaseEventsActions.upsertRecurringPurchaseEvent(result.data.event));
    if (getState().currentRecurringPurchase?.id === id) {
      dispatch(CurrentRecurringPurchaseActions.setCurrentRecurringPurchase(result.data.purchase));
    }
    return { status: 200 };
  };
