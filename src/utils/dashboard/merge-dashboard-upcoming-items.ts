import type { UpcomingCharge } from '@/utils/recurring';
import type { PlannedAnticipatedCharge } from '@/utils/anticipated';

export type DashboardUpcomingItem =
  | {
      kind: 'recurring';
      key: string;
      name: string;
      dueOn: string;
      amountCents: number;
      countsTowardWeekTotal: true;
      recurringPurchaseId: string;
    }
  | {
      kind: 'planned';
      key: string;
      name: string;
      dueOn: string;
      amountCents: number;
      countsTowardWeekTotal: boolean;
      anticipatedCostId: string;
      timeframeLabel: string;
    };

const compareDates = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Merges recurring upcoming charges and planned anticipated costs for dashboard display.
 */
export const mergeDashboardUpcomingItems = (
  recurringCharges: UpcomingCharge[],
  plannedCharges: PlannedAnticipatedCharge[],
  weekRangeStart: string,
): DashboardUpcomingItem[] => {
  const items: DashboardUpcomingItem[] = [
    ...recurringCharges.map((charge) => ({
      kind: 'recurring' as const,
      key: `recurring-${charge.recurringPurchaseId}-${charge.dueOn}`,
      name: charge.name,
      dueOn: charge.dueOn,
      amountCents: charge.amountCents,
      countsTowardWeekTotal: true as const,
      recurringPurchaseId: charge.recurringPurchaseId,
    })),
    ...plannedCharges.map((charge) => ({
      kind: 'planned' as const,
      key: `planned-${charge.anticipatedCostId}-${charge.dueOn}`,
      name:
        charge.occurrenceCount > 1
          ? `${charge.name} (${charge.occurrenceIndex + 1}/${charge.occurrenceCount})`
          : charge.name,
      dueOn: charge.dueOn,
      amountCents: charge.amountCents,
      countsTowardWeekTotal: charge.countsTowardWeekTotal,
      anticipatedCostId: charge.anticipatedCostId,
      timeframeLabel: charge.timeframeLabel,
    })),
  ];

  return items.sort(
    (a, b) => compareDates(a.dueOn, b.dueOn) || a.name.localeCompare(b.name),
  );
};
