import type { AnticipatedCost } from '@/model/anticipated-cost';
import type { Loan } from '@/model/loan';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { sumPlannedAnticipatedMonthlyBudget } from '@/utils/anticipated';
import { sumActiveLoanMonthlyCents } from '@/utils/loans';
import { estimateRecurringMonthlyCents } from '@/utils/recurring';

export type ForwardMonthlyBudget = {
  recurringCents: number;
  anticipatedCents: number;
  loansCents: number;
  totalCents: number;
  activeRecurringCount: number;
  anticipatedScheduledCount: number;
  activeLoanCount: number;
};

/**
 * Average monthly spend going forward from recurring, anticipated, and loan payments.
 */
export const sumForwardMonthlyBudget = (
  recurring: RecurringPurchase[],
  anticipated: AnticipatedCost[],
  loans: Loan[],
): ForwardMonthlyBudget => {
  let recurringCents = 0;
  let activeRecurringCount = 0;

  for (const purchase of recurring) {
    if (!purchase.is_active) continue;
    const monthlyCents = estimateRecurringMonthlyCents(purchase);
    if (monthlyCents <= 0) continue;
    recurringCents += monthlyCents;
    activeRecurringCount += 1;
  }

  const { totalCents: anticipatedCents, scheduledItemCount: anticipatedScheduledCount } =
    sumPlannedAnticipatedMonthlyBudget(anticipated);

  const { totalCents: loansCents, activeLoanCount } = sumActiveLoanMonthlyCents(loans);

  return {
    recurringCents,
    anticipatedCents,
    loansCents,
    totalCents: recurringCents + anticipatedCents + loansCents,
    activeRecurringCount,
    anticipatedScheduledCount,
    activeLoanCount,
  };
};
