import { deleteTransaction } from '@/api/transactions';
import { TransactionsActions } from '@/store/dumps';
import { CurrentTransactionActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes a transaction and clears current selection.
 */
export const deleteTransactionThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await deleteTransaction(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(TransactionsActions.removeTransaction(id));
    dispatch(CurrentTransactionActions.clearCurrentTransaction());
    return { status: 200 };
  };
