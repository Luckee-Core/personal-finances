import type { Loan } from '@/model/loan';
import type { LoanVendor } from '@/model/loan-vendor';

/**
 * Resolves the lender name for a loan from the vendor dump.
 */
export const getLoanVendorName = (
  loan: Loan,
  vendorsById: Record<string, LoanVendor>,
): string => {
  if (!loan.loan_vendor_id) return '—';
  return vendorsById[loan.loan_vendor_id]?.name ?? '—';
};
