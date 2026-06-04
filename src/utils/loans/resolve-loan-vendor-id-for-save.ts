import type { LoanVendor } from '@/model/loan-vendor';
import { createLoanVendorThunk } from '@/store/thunks/loan-vendors/create-loan-vendor-thunk';
import type { ThunkResult } from '@/store/thunks/thunk-result';
import type { AppThunk } from '@/store/types';
import type { RootState } from '@/store/store';

type SaveLoanDispatch = (thunk: AppThunk<Promise<ThunkResult>>) => Promise<ThunkResult>;

type ResolveResult =
  | { ok: true; loanVendorId: string | null }
  | { ok: false; message: string };

const findVendorByName = (
  vendors: Record<string, LoanVendor>,
  name: string,
): LoanVendor | undefined =>
  Object.values(vendors).find(
    (vendor) => vendor.name.toLowerCase() === name.toLowerCase(),
  );

/**
 * Uses an existing vendor id or creates one from newVendorName before saving a loan.
 */
export const resolveLoanVendorIdForSave = async (
  dispatch: SaveLoanDispatch,
  getState: () => RootState,
  selectedVendorId: string,
  newVendorName: string,
): Promise<ResolveResult> => {
  const trimmedNew = newVendorName.trim();
  if (trimmedNew) {
    const existing = findVendorByName(getState().loanVendors, trimmedNew);
    if (existing) {
      return { ok: true, loanVendorId: existing.id };
    }
    const result = await dispatch(createLoanVendorThunk({ name: trimmedNew }));
    if (result.status !== 200) {
      return { ok: false, message: result.message ?? 'Failed to create lender' };
    }
    const created = findVendorByName(getState().loanVendors, trimmedNew);
    return { ok: true, loanVendorId: created?.id ?? null };
  }

  return { ok: true, loanVendorId: selectedVendorId || null };
};
