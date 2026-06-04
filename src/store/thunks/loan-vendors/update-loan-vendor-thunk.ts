import { updateLoanVendor, type UpdateLoanVendorPayload } from '@/api/loan-vendors';
import { LoanVendorsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates a loan vendor and upserts it into the dump.
 */
export const updateLoanVendorThunk =
  (id: string, payload: UpdateLoanVendorPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await updateLoanVendor(id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(LoanVendorsActions.upsertLoanVendor(result.data));
    return { status: 200 };
  };
