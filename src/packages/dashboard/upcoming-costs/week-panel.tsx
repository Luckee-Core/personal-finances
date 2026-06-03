'use client';

import { useRouter } from 'next/navigation';
import { RECURRING_PURCHASE_DETAIL_PATH } from '@/config/routes';
import type { DashboardDateRange } from '@/model/dashboard/time-period';
import { setCurrentRecurringPurchaseThunk } from '@/store/thunks/recurring-purchases/set-current-recurring-purchase-thunk';
import { useAppDispatch } from '@/store/hooks';
import { formatWeekRangeLabel, formatDueDateLabel } from '@/utils/dashboard/get-calendar-week-range';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import type { UpcomingCharge } from '@/utils/recurring/get-upcoming-charges-in-range';
import { formatCents } from '@/utils/format-cents';

type Props = {
  title: string;
  range: DashboardDateRange;
  charges: UpcomingCharge[];
  recurringById: Record<string, RecurringPurchase>;
};

export const DashboardUpcomingWeekPanel = ({
  title,
  range,
  charges,
  recurringById,
}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const totalCents = charges.reduce((sum, c) => sum + c.amountCents, 0);
  const periodLabel = formatWeekRangeLabel(range);

  const openRecurring = (purchaseId: string) => {
    const purchase = recurringById[purchaseId];
    if (!purchase) return;
    dispatch(setCurrentRecurringPurchaseThunk(purchase));
    router.push(RECURRING_PURCHASE_DETAIL_PATH);
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
      {charges.length === 0 ? (
        <p className={styles.empty}>No anticipated charges.</p>
      ) : (
        <ul className={styles.list}>
          {charges.map((charge) => (
            <li key={`${charge.recurringPurchaseId}-${charge.dueOn}`}>
              <button
                type="button"
                className={styles.row}
                onClick={() => openRecurring(charge.recurringPurchaseId)}
              >
                <span className={styles.rowMain}>
                  <span className={styles.rowName}>{charge.name}</span>
                  <span className={styles.rowDate}>{formatDueDateLabel(charge.dueOn)}</span>
                </span>
                <span className={styles.rowAmount}>{formatCents(charge.amountCents)}</span>
              </button>
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
  rowName: `
    text-sm font-medium text-gray-900 truncate
  `,
  rowDate: `
    text-xs text-gray-500
  `,
  rowAmount: `
    text-sm font-medium text-gray-900 shrink-0
  `,
} as const;
