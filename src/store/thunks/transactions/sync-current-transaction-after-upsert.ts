import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { CurrentTransactionActions } from '@/store/current';
import { TransactionsActions } from '@/store/dumps';
import type { Transaction } from '@/model/transaction';
import type { RootState } from '@/store/store';

/** Keeps transaction list and detail view in sync after an update. */
export const syncCurrentTransactionAfterUpsert = (
  dispatch: ThunkDispatch<RootState, unknown, UnknownAction>,
  getState: () => RootState,
  transaction: Transaction,
): void => {
  dispatch(TransactionsActions.upsertTransaction(transaction));
  if (getState().currentTransaction?.id === transaction.id) {
    dispatch(CurrentTransactionActions.setCurrentTransaction(transaction));
  }
};
