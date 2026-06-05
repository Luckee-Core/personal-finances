'use client';

import { useState } from 'react';
import { createBankAccountThunk } from '@/store/thunks/bank-accounts';
import { useAppDispatch } from '@/store/hooks';

const ACCOUNT_TYPES = ['checking', 'savings', 'credit', 'other'] as const;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateBankAccountModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<(typeof ACCOUNT_TYPES)[number]>('checking');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    setIsSaving(true);
    const result = await dispatch(createBankAccountThunk({ name, account_type: accountType }));
    setIsSaving(false);
    if (result.status !== 200) {
      setError(result.message);
      return;
    }
    setName('');
    setAccountType('checking');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>New bank account</h2>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Account name (e.g. Chase Checking)"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className={styles.input}
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as (typeof ACCOUNT_TYPES)[number])}
          >
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
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
            disabled={isSaving || !name.trim()}
            onClick={() => void handleSubmit()}
            className={styles.saveButton}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

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
