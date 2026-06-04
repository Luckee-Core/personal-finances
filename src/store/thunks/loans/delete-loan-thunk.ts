import { deleteLoan } from '@/api/loans';
import { LoansActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes a loan and removes it from the dump.
 */
export const deleteLoanThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await deleteLoan(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(LoansActions.removeLoan(id));
    return { status: 200 };
  };
