import { createBankAccount, type CreateBankAccountPayload } from '@/api/bank-accounts';
import { BankAccountsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a bank account via the API and upserts it into the dump.
 */
export const createBankAccountThunk =
  (payload: CreateBankAccountPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createBankAccount(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(BankAccountsActions.upsertBankAccount(result.data));
    return { status: 200 };
  };
