'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RECURRING_PURCHASE_DETAIL_PATH } from '@/config/routes';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { setCurrentRecurringPurchaseThunk } from '@/store/thunks/recurring-purchases/set-current-recurring-purchase-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import { estimateRecurringMonthlyCents } from '@/utils/recurring';

type Props = {
  hideInactive: boolean;
};

const formatIntervalLabel = (row: RecurringPurchase): string => {
  if (row.billing_interval === 'custom' && row.interval_months) {
    return `Every ${row.interval_months} mo`;
  }
  return row.billing_interval;
};

export const DashboardRecurringTable = ({ hideInactive }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rows = useAppSelector((state) => Object.values(state.recurringPurchases));

  const visibleRows = useMemo(() => {
    const filtered = hideInactive ? rows.filter((row) => row.is_active) : rows;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, hideInactive]);

  const openDetail = (row: RecurringPurchase) => {
    dispatch(setCurrentRecurringPurchaseThunk(row));
    router.push(RECURRING_PURCHASE_DETAIL_PATH);
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Interval</th>
            <th className={styles.th}>Active</th>
            <th className={styles.thRight}>Per payment</th>
            <th className={styles.thRight}>Monthly avg</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr
              key={row.id}
              className={styles.row}
              onClick={() => openDetail(row)}
            >
              <td className={styles.td}>
                <span className={styles.name}>{row.name}</span>
              </td>
              <td className={styles.td}>{formatIntervalLabel(row)}</td>
              <td className={styles.td}>{row.is_active ? 'Yes' : 'No'}</td>
              <td className={styles.tdRight}>{formatCents(row.amount_cents)}</td>
              <td className={styles.tdRight}>
                {formatCents(estimateRecurringMonthlyCents(row))}
              </td>
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                {hideInactive
                  ? 'No active recurring purchases.'
                  : 'No recurring purchases yet.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrapper: `
    overflow-x-auto rounded-lg border border-gray-200 bg-white
  `,
  table: `
    min-w-full text-sm
  `,
  thead: `
    bg-gray-50 text-left text-gray-600
  `,
  th: `
    px-4 py-2 font-medium
  `,
  thRight: `
    px-4 py-2 font-medium text-right
  `,
  row: `
    border-t border-gray-100 cursor-pointer hover:bg-gray-50
  `,
  td: `
    px-4 py-2 text-gray-900
  `,
  tdRight: `
    px-4 py-2 text-right text-gray-900
  `,
  name: `
    font-medium
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
