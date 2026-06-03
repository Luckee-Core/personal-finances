import { createTransaction, type CreateTransactionPayload } from '@/api/transactions';
import { TransactionsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a transaction via the API and upserts it into the dump.
 */
export const createTransactionThunk =
  (payload: CreateTransactionPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createTransaction(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(TransactionsActions.upsertTransaction(result.data));
    return { status: 200 };
  };
