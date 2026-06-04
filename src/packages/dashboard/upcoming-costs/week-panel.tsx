'use client';

import { useRouter } from 'next/navigation';
import { ANTICIPATED_COSTS_PATH, RECURRING_PURCHASE_DETAIL_PATH } from '@/config/routes';
import type { DashboardDateRange } from '@/model/dashboard/time-period';
import { setCurrentRecurringPurchaseThunk } from '@/store/thunks/recurring-purchases/set-current-recurring-purchase-thunk';
import { useAppDispatch } from '@/store/hooks';
import { formatWeekRangeLabel, formatDueDateLabel } from '@/utils/dashboard/get-calendar-week-range';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import type { DashboardUpcomingItem } from '@/utils/dashboard/merge-dashboard-upcoming-items';
import { formatCents } from '@/utils/format-cents';

type Props = {
  title: string;
  range: DashboardDateRange;
  items: DashboardUpcomingItem[];
  recurringById: Record<string, RecurringPurchase>;
};

export const DashboardUpcomingWeekPanel = ({
  title,
  range,
  items,
  recurringById,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const totalCents = items.reduce(
    (sum, item) => sum + (item.countsTowardWeekTotal ? item.amountCents : 0),
    0,
  );
  const periodLabel = formatWeekRangeLabel(range);

  const openRecurring = (purchaseId: string) => {
    const purchase = recurringById[purchaseId];
    if (!purchase) return;
    dispatch(setCurrentRecurringPurchaseThunk(purchase));
    router.push(RECURRING_PURCHASE_DETAIL_PATH);
  };

  const openPlanned = () => {
    router.push(ANTICIPATED_COSTS_PATH);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h3 className={styles.panelTitle}>{title}</h3>
          <p className={styles.panelPeriod}>{periodLabel}</p>
        </div>
        <p className={styles.panelTotal}>{formatCents(totalCents)}</p>
      </div>
      {items.length === 0 ? (
        <p className={styles.empty}>No anticipated charges.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.key}>
              {item.kind === 'recurring' ? (
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => openRecurring(item.recurringPurchaseId)}
                >
                  <span className={styles.rowMain}>
                    <span className={styles.rowNameRow}>
                      <span className={styles.rowName}>{item.name}</span>
                      <span className={styles.badgeRecurring}>Recurring</span>
                    </span>
                    <span className={styles.rowDate}>{formatDueDateLabel(item.dueOn)}</span>
                  </span>
                  <span className={styles.rowAmount}>{formatCents(item.amountCents)}</span>
                </button>
              ) : (
                <button type="button" className={styles.row} onClick={openPlanned}>
                  <span className={styles.rowMain}>
                    <span className={styles.rowNameRow}>
                      <span className={styles.rowName}>{item.name}</span>
                      <span className={styles.badgePlanned}>Planned</span>
                    </span>
                    <span className={styles.rowDate}>{formatDueDateLabel(item.dueOn)}</span>
                  </span>
                  <span className={styles.rowAmount}>{formatCents(item.amountCents)}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  panel: `
    rounded-lg border border-gray-200 bg-white p-5
  `,
  panelHeader: `
    flex items-start justify-between gap-3
  `,
  panelTitle: `
    text-sm font-semibold text-gray-900
  `,
  panelPeriod: `
    text-xs text-gray-500
  `,
  panelTotal: `
    text-xl font-semibold text-gray-900 shrink-0
  `,
  empty: `
    mt-4 text-sm text-gray-500
  `,
  list: `
    mt-4 divide-y divide-gray-100
  `,
  row: `
    flex w-full items-center justify-between gap-3 py-2.5 text-left
    hover:bg-gray-50 -mx-1 px-1 rounded
  `,
  rowMain: `
    min-w-0 flex flex-col gap-0.5
  `,
  rowNameRow: `
    flex items-center gap-2 min-w-0
  `,
  rowName: `
    text-sm font-medium text-gray-900 truncate
  `,
  rowDate: `
    text-xs text-gray-500
  `,
  rowAmount: `
    text-sm font-medium text-gray-900 shrink-0
  `,
  badgeRecurring: `
    shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-700
  `,
  badgePlanned: `
    shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800
  `,
} as const;
