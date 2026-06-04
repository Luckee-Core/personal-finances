import { createLoanVendor, type CreateLoanVendorPayload } from '@/api/loan-vendors';
import { LoanVendorsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a loan vendor and upserts it into the dump.
 */
export const createLoanVendorThunk =
  (payload: CreateLoanVendorPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createLoanVendor(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(LoanVendorsActions.upsertLoanVendor(result.data));
    return { status: 200 };
  };
