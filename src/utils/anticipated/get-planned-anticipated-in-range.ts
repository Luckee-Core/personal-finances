import type { DashboardDateRange } from '@/model/dashboard/time-period';
import type { AnticipatedCost } from '@/model/anticipated-cost';
import { anticipatedDueOnInRange } from './get-anticipated-timeframe-bounds';
import { getAnticipatedOccurrenceDates } from './get-anticipated-occurrence-dates';
import { getAnticipatedTimeframeBounds } from './get-anticipated-timeframe-bounds';

export type PlannedAnticipatedCharge = {
  anticipatedCostId: string;
  name: string;
  dueOn: string;
  amountCents: number;
  timeframeLabel: string;
  countsTowardWeekTotal: boolean;
  occurrenceIndex: number;
  occurrenceCount: number;
};

const compareDates = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Lists planned anticipated payment dates that fall within the given week range.
 */
export const getPlannedAnticipatedInRange = (
  costs: AnticipatedCost[],
  range: DashboardDateRange,
): PlannedAnticipatedCharge[] => {
  const charges: PlannedAnticipatedCharge[] = [];

  for (const cost of costs) {
    if (cost.status !== 'planned') continue;

    const every = cost.timeframe_every ?? 1;
    const occurrenceDates = getAnticipatedOccurrenceDates(
      cost.due_on,
      cost.timeframe_interval,
      cost.timeframe_count,
      every,
    );
    const occurrenceCount = occurrenceDates.length;
    const { start, end } = getAnticipatedTimeframeBounds(
      cost.due_on,
      cost.timeframe_interval,
      cost.timeframe_count,
      every,
    );
    const timeframeLabel = start === end ? start : `${start} – ${end}`;

    occurrenceDates.forEach((paymentDate, occurrenceIndex) => {
      if (!anticipatedDueOnInRange(paymentDate, range.start, range.end)) {
        return;
      }

      charges.push({
        anticipatedCostId: cost.id,
        name: cost.name,
        dueOn: paymentDate,
        amountCents: cost.amount_cents,
        timeframeLabel,
        countsTowardWeekTotal: true,
        occurrenceIndex,
        occurrenceCount,
      });
    });
  }

  return charges.sort(
    (a, b) =>
      compareDates(a.dueOn, b.dueOn) ||
      a.name.localeCompare(b.name) ||
      a.occurrenceIndex - b.occurrenceIndex,
  );
};
