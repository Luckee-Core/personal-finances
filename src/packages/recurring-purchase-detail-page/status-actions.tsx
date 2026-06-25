'use client';

import type { RecurringPurchase } from '@/model/recurring-purchase';
import { changeRecurringPurchaseStatusThunk } from '@/store/thunks/recurring-purchases';
import { useAppDispatch } from '@/store/hooks';
import { getRecurringPurchaseStatusLabel, resolveRecurringPurchaseStatus } from '@/utils/recurring';

type Props = {
  purchase: RecurringPurchase;
  onPauseClick: () => void;
};

const resolveStatus = resolveRecurringPurchaseStatus;

/**
 * Status badge and action buttons for a recurring purchase.
 */
export const StatusActions = ({ purchase, onPauseClick }: Props) => {
  const dispatch = useAppDispatch();
  const status = resolveStatus(purchase);

  const handleResume = async () => {
    await dispatch(
      changeRecurringPurchaseStatusThunk(purchase.id, {
        status: 'active',
      }),
    );
  };

  const handleCancel = async () => {
    if (!window.confirm(`Cancel recurring purchase "${purchase.name}"?`)) return;
    await dispatch(
      changeRecurringPurchaseStatusThunk(purchase.id, {
        status: 'cancelled',
      }),
    );
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <p className={styles.label}>Status</p>
        <p className={styles.badge}>{getRecurringPurchaseStatusLabel(status)}</p>
        {status === 'paused' && purchase.paused_until && (
          <p className={styles.meta}>Paused until {purchase.paused_until.slice(0, 10)}</p>
        )}
      </div>
      <div className={styles.actions}>
        {status === 'active' && (
          <>
            <button type="button" className={styles.secondaryButton} onClick={onPauseClick}>
              Pause
            </button>
            <button type="button" className={styles.dangerButton} onClick={() => void handleCancel()}>
              Cancel
            </button>
          </>
        )}
        {(status === 'paused' || status === 'cancelled') && (
          <button type="button" className={styles.primaryButton} onClick={() => void handleResume()}>
            Resume
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between
  `,
  label: `
    text-xs text-gray-500
  `,
  badge: `
    text-sm font-semibold capitalize text-gray-900
  `,
  meta: `
    text-xs text-gray-600
  `,
  actions: `
    flex flex-wrap gap-2
  `,
  primaryButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white
  `,
  secondaryButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700
  `,
  dangerButton: `
    rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700
  `,
} as const;
