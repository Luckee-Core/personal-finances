'use client';

import { useEffect, useState } from 'react';
import type { LoanVendor } from '@/model/loan-vendor';
import { createLoanVendorThunk, updateLoanVendorThunk } from '@/store/thunks/loan-vendors';
import { useAppDispatch } from '@/store/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  vendor?: LoanVendor | null;
};

export const LoanVendorFormModal = ({ isOpen, onClose, vendor }: Props) => {
  const dispatch = useAppDispatch();
  const isEdit = vendor != null;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(vendor?.name ?? '');
    setError('');
  }, [isOpen, vendor]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);
    const result = isEdit
      ? await dispatch(updateLoanVendorThunk(vendor.id, { name: trimmed }))
      : await dispatch(createLoanVendorThunk({ name: trimmed }));
    setIsSaving(false);

    if (result.status !== 200) {
      setError(result.message ?? 'Failed to save');
      return;
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>{isEdit ? 'Edit lender' : 'New lender'}</h2>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Lender name (e.g. SoFi)"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {isSaving ? 'Saving…' : isEdit ? 'Save' : 'Add'}
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
