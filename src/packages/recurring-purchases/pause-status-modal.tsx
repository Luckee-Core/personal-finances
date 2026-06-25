'use client';

import { useEffect, useState } from 'react';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { changeRecurringPurchaseStatusThunk } from '@/store/thunks/recurring-purchases';
import { useAppDispatch } from '@/store/hooks';

type Props = {
  isOpen: boolean;
  purchase: RecurringPurchase | null;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * Modal to pause a recurring purchase for a required number of days.
 */
export const PauseStatusModal = ({ isOpen, purchase, onClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const [pauseDays, setPauseDays] = useState('30');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPauseDays('30');
    setNotes('');
    setError(null);
  }, [isOpen, purchase?.id]);

  if (!isOpen || !purchase) return null;

  const handleSubmit = async () => {
    const days = Math.round(Number(pauseDays));
    if (!Number.isFinite(days) || days <= 0) {
      setError('Enter a positive number of days');
      return;
    }

    setSaving(true);
    setError(null);
    const result = await dispatch(
      changeRecurringPurchaseStatusThunk(purchase.id, {
        status: 'paused',
        pause_days: days,
        notes: notes.trim() || null,
      }),
    );
    setSaving(false);

    if (result.status !== 200) {
      setError(result.message ?? 'Failed to pause recurring purchase');
      return;
    }

    onSuccess?.();
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <h2 className={styles.title}>Pause {purchase.name}</h2>
        <p className={styles.subtitle}>How many days should this recurring purchase stay paused?</p>
        <label className={styles.label}>
          Pause for (days)
          <input
            type="number"
            min={1}
            step={1}
            className={styles.input}
            value={pauseDays}
            onChange={(e) => setPauseDays(e.target.value)}
          />
        </label>
        <label className={styles.label}>
          Notes (optional)
          <textarea
            className={styles.textarea}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className={styles.submitButton} onClick={() => void handleSubmit()} disabled={saving}>
            {saving ? 'Saving…' : 'Pause'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4
  `,
  panel: `
    w-full max-w-md rounded-lg bg-white p-5 shadow-lg space-y-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  label: `
    block text-sm font-medium text-gray-700 space-y-1
  `,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  textarea: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  error: `
    text-sm text-red-600
  `,
  actions: `
    flex justify-end gap-2
  `,
  cancelButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700
  `,
  submitButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50
  `,
} as const;
