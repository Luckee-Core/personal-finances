'use client';

import { useEffect, useState } from 'react';
import {
  createRecurringPurchaseThunk,
  updateRecurringPurchaseThunk,
} from '@/store/thunks/recurring-purchases';
import { useAppDispatch } from '@/store/hooks';
import {
  BILLING_INTERVAL_OPTIONS,
  type BillingInterval,
  type RecurringPurchase,
} from '@/model/recurring-purchase';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** When set, the modal edits this purchase instead of creating a new one. */
  purchase?: RecurringPurchase | null;
};

export const RecurringPurchaseFormModal = ({ isOpen, onClose, purchase }: Props) => {
  const dispatch = useAppDispatch();
  const isEdit = purchase != null;
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (purchase) {
      setName(purchase.name);
      setAmount(String(purchase.amount_cents / 100));
      setBillingInterval(purchase.billing_interval);
    } else {
      setName('');
      setAmount('');
      setBillingInterval('monthly');
    }
    setError('');
  }, [isOpen, purchase]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    const amountCents = Math.round(Number(amount) * 100);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!Number.isFinite(amountCents) || amountCents < 0) {
      setError('Enter a valid amount');
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      amount_cents: amountCents,
      billing_interval: billingInterval,
    };
    const result = isEdit
      ? await dispatch(updateRecurringPurchaseThunk(purchase.id, payload))
      : await dispatch(createRecurringPurchaseThunk(payload));
    setIsSaving(false);
    if (result.status !== 200) {
      setError(result.message);
      return;
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>
          {isEdit ? 'Edit recurring purchase' : 'New recurring purchase'}
        </h2>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount (USD)"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className={styles.input}
            value={billingInterval}
            onChange={(e) => setBillingInterval(e.target.value as BillingInterval)}
          >
            {BILLING_INTERVAL_OPTIONS.map((interval) => (
              <option key={interval} value={interval}>
                {interval.charAt(0).toUpperCase() + interval.slice(1)}
              </option>
            ))}
          </select>
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSubmit()}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

/** @deprecated Use RecurringPurchaseFormModal */
export const CreateRecurringPurchaseModal = RecurringPurchaseFormModal;

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4
  `,
  panel: `
    w-full max-w-md rounded-lg bg-white p-5 shadow-lg
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  fields: `
    mt-4 space-y-3
  `,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  error: `
    text-sm text-red-600
  `,
  actions: `
    mt-5 flex justify-end gap-2
  `,
  cancelButton: `
    rounded-md px-3 py-1.5 text-sm text-gray-700
  `,
  saveButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50
  `,
} as const;
