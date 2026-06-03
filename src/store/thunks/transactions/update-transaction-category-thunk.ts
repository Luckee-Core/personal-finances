import { updateTransaction } from '@/api/transactions';
import { syncCurrentTransactionAfterUpsert } from './sync-current-transaction-after-upsert';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Sets category_id on a transaction (manual override, no AI).
 */
export const updateTransactionCategoryThunk =
  (transactionId: string, categoryId: string | null): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await updateTransaction(transactionId, { category_id: categoryId });
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    syncCurrentTransactionAfterUpsert(dispatch, getState, result.data);
    return { status: 200 };
  };
