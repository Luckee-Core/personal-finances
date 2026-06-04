import { updateLoan, type UpdateLoanPayload } from '@/api/loans';
import { LoansActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates a loan and upserts it into the dump.
 */
export const updateLoanThunk =
  (id: string, payload: UpdateLoanPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await updateLoan(id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(LoansActions.upsertLoan(result.data));
    return { status: 200 };
  };
