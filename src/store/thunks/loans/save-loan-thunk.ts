import type { CreateLoanPayload } from '@/api/loans';
import type { LoanVendor } from '@/model/loan-vendor';
import { createLoanVendorThunk } from '@/store/thunks/loan-vendors';
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

const findVendorByName = (
  vendors: Record<string, LoanVendor>,
  name: string,
): LoanVendor | undefined =>
  Object.values(vendors).find(
    (vendor) => vendor.name.toLowerCase() === name.toLowerCase(),
  );

/**
 * Resolves lender (existing or new vendor), then creates or updates the loan.
 */
export const saveLoanThunk =
  (input: SaveLoanInput): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const trimmedNew = input.newVendorName.trim();
    let loanVendorId: string | null = input.loanVendorId || null;

    if (trimmedNew) {
      const existing = findVendorByName(getState().loanVendors, trimmedNew);
      if (existing) {
        loanVendorId = existing.id;
      } else {
        const vendorResult = await dispatch(createLoanVendorThunk({ name: trimmedNew }));
        if (vendorResult.status !== 200) {
          return {
            status: 400,
            message: vendorResult.message ?? 'Failed to create lender',
          };
        }
        const created = findVendorByName(getState().loanVendors, trimmedNew);
        loanVendorId = created?.id ?? null;
      }
    }

    const payload: CreateLoanPayload = {
      name: input.name,
      loan_vendor_id: loanVendorId,
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
