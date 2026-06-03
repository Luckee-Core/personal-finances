import { CurrentTransactionActions } from '@/store/current';
import type { Transaction } from '@/model/transaction';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Sets the current transaction for detail navigation.
 */
export const setCurrentTransactionThunk =
  (transaction: Transaction): AppThunk<ThunkStatus> =>
  (dispatch) => {
    dispatch(CurrentTransactionActions.setCurrentTransaction(transaction));
    return 200;
  };
