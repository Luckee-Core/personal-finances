'use client';

import { useEffect, useState } from 'react';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { changeRecurringPurchaseNextDueThunk } from '@/store/thunks/recurring-purchases';
import { useAppDispatch } from '@/store/hooks';

type Props = {
  purchase: RecurringPurchase;
};

/**
 * Editable next payment date field for a recurring purchase.
 */
export const NextDueEditor = ({ purchase }: Props) => {
  const dispatch = useAppDispatch();
  const currentValue = purchase.next_due_at?.slice(0, 10) ?? '';
  const [nextDueAt, setNextDueAt] = useState(currentValue);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNextDueAt(purchase.next_due_at?.slice(0, 10) ?? '');
    setNotes('');
    setError(null);
  }, [purchase.id, purchase.next_due_at]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await dispatch(
      changeRecurringPurchaseNextDueThunk(purchase.id, {
        next_due_at: nextDueAt.trim() || null,
        notes: notes.trim() || null,
      }),
    );
    setSaving(false);
    if (result.status !== 200) {
      setError(result.message ?? 'Failed to update next payment date');
    }
  };

  const isDirty = nextDueAt !== currentValue;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        Next payment date
        <input
          type="date"
          className={styles.input}
          value={nextDueAt}
          onChange={(e) => setNextDueAt(e.target.value)}
        />
      </label>
      {isDirty && (
        <label className={styles.label}>
          Notes (optional)
          <input
            type="text"
            className={styles.input}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for date change"
          />
        </label>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {isDirty && (
        <button
          type="button"
          className={styles.saveButton}
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Save next payment date'}
        </button>
      )}
    </div>
  );
};

const styles = {
  wrapper: `
    space-y-3 rounded-lg border border-gray-200 bg-white p-4
  `,
  label: `
    block text-sm font-medium text-gray-700 space-y-1
  `,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  error: `
    text-sm text-red-600
  `,
  saveButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50
  `,
} as const;
