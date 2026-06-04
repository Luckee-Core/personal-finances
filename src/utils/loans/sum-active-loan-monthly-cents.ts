import type { Loan } from '@/model/loan';

export type ActiveLoanMonthlySummary = {
  totalCents: number;
  activeLoanCount: number;
  totalBalanceCents: number;
};

/**
 * Sums monthly payments and balances for active loans.
 */
export const sumActiveLoanMonthlyCents = (loans: Loan[]): ActiveLoanMonthlySummary => {
  let totalCents = 0;
  let totalBalanceCents = 0;
  let activeLoanCount = 0;

  for (const loan of loans) {
    if (!loan.is_active) continue;
    totalCents += loan.monthly_payment_cents;
    totalBalanceCents += loan.balance_cents;
    activeLoanCount += 1;
  }

  return { totalCents, activeLoanCount, totalBalanceCents };
};
