import { getAllTransactions } from '@/api/transactions';
import { TransactionsActions } from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Reloads transactions using current filter state.
 */
export const loadTransactionsThunk =
  (): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch, getState) => {
    const filters = getState().transactionFilters;
    const result = await getAllTransactions({
      bankAccountId: filters.bankAccountId || undefined,
      categoryId: filters.categoryId || undefined,
      source: filters.source || undefined,
    });

    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }

    dispatch(TransactionsActions.setTransactions(rowsToEntityRecord(result.data)));
    return 200;
  };
