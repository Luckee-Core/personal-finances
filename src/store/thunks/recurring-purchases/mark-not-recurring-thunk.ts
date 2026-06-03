import { markRecurringPurchaseNotRecurring } from '@/api/recurring-purchases';
import { CurrentRecurringPurchaseActions } from '@/store/current';
import { NotRecurringActions, RecurringPurchasesActions, TransactionsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes a recurring purchase and records its slug in not_recurring for AI detection.
 */
export const markNotRecurringThunk =
  (recurringPurchaseId: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await markRecurringPurchaseNotRecurring(recurringPurchaseId);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    dispatch(RecurringPurchasesActions.removeRecurringPurchase(recurringPurchaseId));
    dispatch(NotRecurringActions.upsertNotRecurring(result.data.not_recurring));

    if (getState().currentRecurringPurchase?.id === recurringPurchaseId) {
      dispatch(CurrentRecurringPurchaseActions.clearCurrentRecurringPurchase());
    }

    for (const txn of Object.values(getState().transactions)) {
      if (txn.recurring_purchase_id !== recurringPurchaseId) continue;
      dispatch(
        TransactionsActions.upsertTransaction({
          ...txn,
          recurring_purchase_id: null,
        }),
      );
    }

    return { status: 200 };
  };
