'use client';

import { useMemo } from 'react';
import type { RecurringPurchaseEvent } from '@/model/recurring-purchase-event';
import { getRecurringPurchaseStatusLabel } from '@/utils/recurring';

type Props = {
  events: RecurringPurchaseEvent[];
};

const formatDate = (value: string | null): string => {
  if (!value) return '—';
  return value.slice(0, 10);
};

const formatEventLabel = (event: RecurringPurchaseEvent): string => {
  if (event.event_type === 'next_due_change') {
    return 'Next payment date';
  }
  return event.status ? getRecurringPurchaseStatusLabel(event.status) : 'Status change';
};

const formatEventDetail = (event: RecurringPurchaseEvent): string => {
  if (event.event_type === 'next_due_change') {
    return `${formatDate(event.previous_next_due_at)} → ${formatDate(event.next_due_at)}`;
  }
  if (event.status === 'paused' && event.pause_days) {
    const until = event.paused_until ? ` until ${formatDate(event.paused_until)}` : '';
    return `${event.pause_days} day${event.pause_days === 1 ? '' : 's'}${until}`;
  }
  return '—';
};

/**
 * Unified history table for recurring purchase events.
 */
export const HistoryTable = ({ events }: Props) => {
  const rows = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [events],
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>History</h2>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Event</th>
            <th className={styles.th}>Detail</th>
            <th className={styles.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((event) => (
            <tr key={event.id} className={styles.row}>
              <td className={styles.td}>{formatDate(event.created_at)}</td>
              <td className={styles.td}>{formatEventLabel(event)}</td>
              <td className={styles.td}>{formatEventDetail(event)}</td>
              <td className={styles.td}>{event.notes ?? '—'}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.empty}>
                No history yet.
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
    space-y-3
  `,
  heading: `
    text-lg font-semibold text-gray-900
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
  row: `
    border-t border-gray-100
  `,
  td: `
    px-4 py-2 align-top
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
