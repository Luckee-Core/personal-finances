'use client';

import { useState } from 'react';
import { createCreditCardThunk } from '@/store/thunks/credit-cards';
import { useAppDispatch } from '@/store/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateCreditCardModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    setIsSaving(true);
    const result = await dispatch(
      createCreditCardThunk({
        name,
        issuer: issuer.trim() || null,
        last_four: lastFour.trim() || null,
      }),
    );
    setIsSaving(false);
    if (result.status !== 200) {
      setError(result.message);
      return;
    }
    setName('');
    setIssuer('');
    setLastFour('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>New credit card</h2>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Card name (e.g. Chase Sapphire)"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Issuer (optional)"
            className={styles.input}
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last 4 digits (optional)"
            className={styles.input}
            value={lastFour}
            maxLength={4}
            onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ''))}
          />
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
  overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4`,
  panel: `w-full max-w-md rounded-lg bg-white p-5 shadow-lg`,
  heading: `text-lg font-semibold text-gray-900`,
  fields: `mt-4 space-y-3`,
  input: `w-full rounded-md border border-gray-300 px-3 py-2 text-sm`,
  error: `text-sm text-red-600`,
  actions: `mt-5 flex justify-end gap-2`,
  cancelButton: `rounded-md px-3 py-1.5 text-sm text-gray-700`,
  saveButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
} as const;
