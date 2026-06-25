'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RECURRING_PATH } from '@/config/routes';
import { PauseStatusModal } from '@/packages/recurring-purchases/pause-status-modal';
import {
  deleteRecurringPurchaseThunk,
  loadRecurringPurchaseEventsThunk,
} from '@/store/thunks/recurring-purchases';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import { HistoryTable } from './history-table';
import { NextDueEditor } from './next-due-editor';
import { StatusActions } from './status-actions';

export const RecurringPurchaseDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const purchase = useAppSelector((state) => state.currentRecurringPurchase);
  const allEvents = useAppSelector((state) => state.recurringPurchaseEvents);
  const [pauseOpen, setPauseOpen] = useState(false);

  const events = useMemo(() => {
    if (!purchase) return [];
    return Object.values(allEvents).filter((event) => event.recurring_purchase_id === purchase.id);
  }, [allEvents, purchase]);

  useEffect(() => {
    if (!purchase?.id) return;
    void dispatch(loadRecurringPurchaseEventsThunk(purchase.id));
  }, [dispatch, purchase?.id]);

  if (!purchase) {
    return (
      <p className={styles.empty}>
        No recurring purchase selected.{' '}
        <button
          type="button"
          className={styles.emptyLink}
          onClick={() => router.push(RECURRING_PATH)}
        >
          Back to list
        </button>
      </p>
    );
  }

  const handleDelete = async () => {
    const result = await dispatch(deleteRecurringPurchaseThunk(purchase.id));
    if (result.status !== 200) return;
    router.push(RECURRING_PATH);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{purchase.name}</h1>
          <p className={`${styles.subtitle} capitalize`}>{purchase.billing_interval}</p>
        </div>
        <button type="button" onClick={() => void handleDelete()} className={styles.deleteButton}>
          Delete
        </button>
      </div>

      <StatusActions purchase={purchase} onPauseClick={() => setPauseOpen(true)} />

      <dl className={styles.details}>
        <div>
          <dt className={styles.term}>Amount</dt>
          <dd className={styles.value}>{formatCents(purchase.amount_cents)}</dd>
        </div>
        <div>
          <dt className={styles.term}>Vendor</dt>
          <dd className={styles.value}>{purchase.vendor ?? '—'}</dd>
        </div>
      </dl>

      <NextDueEditor purchase={purchase} />

      {purchase.notes && <p className={styles.notes}>{purchase.notes}</p>}

      <HistoryTable events={events} />

      <PauseStatusModal
        isOpen={pauseOpen}
        purchase={purchase}
        onClose={() => setPauseOpen(false)}
      />
    </div>
  );
};

const styles = {
  page: `
    space-y-4
  `,
  empty: `
    text-sm text-gray-600
  `,
  emptyLink: `
    underline
  `,
  header: `
    flex items-start justify-between
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  deleteButton: `
    rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700
  `,
  details: `
    grid gap-3 rounded-lg border border-gray-200 bg-white p-5
    sm:grid-cols-2
  `,
  term: `
    text-xs text-gray-500
  `,
  value: `
    text-sm font-medium
  `,
  notes: `
    rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700
  `,
} as const;
