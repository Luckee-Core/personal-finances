import { deleteLoanVendor } from '@/api/loan-vendors';
import { LoansActions, LoanVendorsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes a loan vendor, removes it from the dump, and clears lender links on loans.
 */
export const deleteLoanVendorThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await deleteLoanVendor(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(LoanVendorsActions.removeLoanVendor(id));
    for (const loan of Object.values(getState().loans)) {
      if (loan.loan_vendor_id === id) {
        dispatch(LoansActions.upsertLoan({ ...loan, loan_vendor_id: null }));
      }
    }
    return { status: 200 };
  };
