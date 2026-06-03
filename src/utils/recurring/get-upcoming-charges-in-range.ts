import type { DashboardDateRange } from '@/model/dashboard/time-period';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import type { Transaction } from '@/model/transaction';
import { addBillingInterval } from './recurring-date-math';

export type UpcomingCharge = {
  recurringPurchaseId: string;
  name: string;
  dueOn: string;
  amountCents: number;
};

const compareDates = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const lastLinkedPostedOn = (
  purchaseId: string,
  transactions: Transaction[],
): string | null => {
  let latest: string | null = null;
  for (const txn of transactions) {
    if (txn.recurring_purchase_id !== purchaseId) continue;
    if (!latest || txn.posted_on > latest) {
      latest = txn.posted_on;
    }
  }
  return latest;
};

const getFirstDueOn = (
  purchase: RecurringPurchase,
  transactions: Transaction[],
): string => {
  if (purchase.next_due_at) {
    return purchase.next_due_at.slice(0, 10);
  }
  const lastPosted = lastLinkedPostedOn(purchase.id, transactions);
  if (lastPosted) {
    return addBillingInterval(
      lastPosted,
      purchase.billing_interval,
      purchase.interval_months,
    );
  }
  return purchase.started_at.slice(0, 10);
};

const isDueActive = (purchase: RecurringPurchase, dueOn: string): boolean => {
  if (!purchase.is_active) return false;
  const endsOn = purchase.ends_at?.slice(0, 10);
  if (endsOn && endsOn < dueOn) return false;
  const startedOn = purchase.started_at.slice(0, 10);
  if (startedOn > dueOn) return false;
  return true;
};

/**
 * Lists anticipated charge dates for active recurring purchases within an inclusive date range.
 */
export const getUpcomingChargesInRange = (
  purchases: RecurringPurchase[],
  transactions: Transaction[],
  range: DashboardDateRange,
): UpcomingCharge[] => {
  const charges: UpcomingCharge[] = [];

  for (const purchase of purchases) {
    if (!purchase.is_active) continue;

    let dueOn = getFirstDueOn(purchase, transactions);
    const { billing_interval: interval, interval_months: intervalMonths } = purchase;

    while (compareDates(dueOn, range.start) < 0) {
      dueOn = addBillingInterval(dueOn, interval, intervalMonths);
    }

    while (compareDates(dueOn, range.end) <= 0) {
      if (isDueActive(purchase, dueOn)) {
        charges.push({
          recurringPurchaseId: purchase.id,
          name: purchase.name,
          dueOn,
          amountCents: purchase.amount_cents,
        });
      }
      dueOn = addBillingInterval(dueOn, interval, intervalMonths);
    }
  }

  return charges.sort(
    (a, b) => compareDates(a.dueOn, b.dueOn) || a.name.localeCompare(b.name),
  );
};

export const sumUpcomingChargeCents = (charges: UpcomingCharge[]): number =>
  charges.reduce((sum, c) => sum + c.amountCents, 0);
