import type { CreateLoanPayload } from '@/api/loans';
import { resolveLoanVendorIdForSave } from '@/utils/loans';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';
import { createLoanThunk } from './create-loan-thunk';
import { updateLoanThunk } from './update-loan-thunk';

export type SaveLoanInput = {
  loanId?: string;
  name: string;
  balance_cents: number;
  monthly_payment_cents: number;
  notes: string | null;
  is_active: boolean;
  loanVendorId: string;
  newVendorName: string;
};

/**
 * Resolves lender (existing or new vendor), then creates or updates the loan.
 */
export const saveLoanThunk =
  (input: SaveLoanInput): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const vendorResult = await resolveLoanVendorIdForSave(
      dispatch,
      getState,
      input.loanVendorId,
      input.newVendorName,
    );
    if (!vendorResult.ok) {
      return { status: 400, message: vendorResult.message };
    }

    const payload: CreateLoanPayload = {
      name: input.name,
      loan_vendor_id: vendorResult.loanVendorId,
      balance_cents: input.balance_cents,
      monthly_payment_cents: input.monthly_payment_cents,
      notes: input.notes,
      is_active: input.is_active,
    };

    if (input.loanId) {
      return dispatch(updateLoanThunk(input.loanId, payload));
    }
    return dispatch(createLoanThunk(payload));
  };
