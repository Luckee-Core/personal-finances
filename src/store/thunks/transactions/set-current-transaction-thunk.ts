import { CurrentTransactionActions } from '@/store/current';
import type { Transaction } from '@/model/transaction';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Sets the current transaction for detail navigation.
 */
export const setCurrentTransactionThunk =
  (transaction: Transaction): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    dispatch(CurrentTransactionActions.setCurrentTransaction(transaction));
    return { status: 200 };
  };
