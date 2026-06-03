import { deleteTransaction } from '@/api/transactions';
import { TransactionsActions } from '@/store/dumps';
import { CurrentTransactionActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Deletes a transaction and clears current selection.
 */
export const deleteTransactionThunk =
  (id: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await deleteTransaction(id);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(TransactionsActions.removeTransaction(id));
    dispatch(CurrentTransactionActions.clearCurrentTransaction());
    return 200;
  };
