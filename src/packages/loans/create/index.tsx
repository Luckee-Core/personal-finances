'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Loan } from '@/model/loan';
import { saveLoanThunk } from '@/store/thunks/loans/save-loan-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  loan?: Loan | null;
};

export const LoanFormModal = ({ isOpen, onClose, loan }: Props) => {
  const dispatch = useAppDispatch();
  const vendors = useAppSelector((state) => Object.values(state.loanVendors));
  const isEdit = loan != null;
  const [name, setName] = useState('');
  const [loanVendorId, setLoanVendorId] = useState('');
  const [newVendorName, setNewVendorName] = useState('');
  const [balance, setBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const sortedVendors = useMemo(
    () => [...vendors].sort((a, b) => a.name.localeCompare(b.name)),
    [vendors],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (loan) {
      setName(loan.name);
      setLoanVendorId(loan.loan_vendor_id ?? '');
      setNewVendorName('');
      setBalance(String(loan.balance_cents / 100));
      setMonthlyPayment(String(loan.monthly_payment_cents / 100));
      setNotes(loan.notes ?? '');
      setIsActive(loan.is_active);
    } else {
      setName('');
      setLoanVendorId('');
      setNewVendorName('');
      setBalance('');
      setMonthlyPayment('');
      setNotes('');
      setIsActive(true);
    }
    setError('');
  }, [isOpen, loan]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    const balanceCents = Math.round(Number(balance) * 100);
    const monthlyPaymentCents = Math.round(Number(monthlyPayment) * 100);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!Number.isFinite(balanceCents) || balanceCents < 0) {
      setError('Enter a valid balance');
      return;
    }
    if (!Number.isFinite(monthlyPaymentCents) || monthlyPaymentCents < 0) {
      setError('Enter a valid monthly payment');
      return;
    }

    setIsSaving(true);
    const result = await dispatch(
      saveLoanThunk({
        loanId: isEdit ? loan.id : undefined,
        name: name.trim(),
        balance_cents: balanceCents,
        monthly_payment_cents: monthlyPaymentCents,
        notes: notes.trim() || null,
        is_active: isActive,
        loanVendorId,
        newVendorName,
      }),
    );
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
        <h2 className={styles.heading}>{isEdit ? 'Edit loan' : 'New loan'}</h2>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Name (e.g. Car loan)"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <label className={styles.fieldLabel} htmlFor="loan-vendor-select">
              Lender
            </label>
            <select
              id="loan-vendor-select"
              className={styles.input}
              value={loanVendorId}
              onChange={(e) => setLoanVendorId(e.target.value)}
              disabled={Boolean(newVendorName.trim())}
            >
              <option value="">None</option>
              {sortedVendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel} htmlFor="loan-vendor-new">
              Or new lender
            </label>
            <input
              id="loan-vendor-new"
              type="text"
              placeholder="Creates a loan vendor if new"
              className={styles.input}
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
            />
          </div>
          <input
            type="number"
            step="0.01"
            placeholder="Current balance (USD)"
            className={styles.input}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Monthly payment (USD)"
            className={styles.input}
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
          />
          {isEdit && (
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Active</span>
            </label>
          )}
          <textarea
            placeholder="Notes (optional)"
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSaving}
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
  overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4`,
  panel: `w-full max-w-md rounded-lg bg-white p-6 shadow-lg`,
  heading: `text-lg font-semibold text-gray-900`,
  fields: `mt-4 space-y-3`,
  fieldLabel: `block text-xs font-medium text-gray-600 mb-1`,
  input: `w-full rounded-md border border-gray-300 px-3 py-2 text-sm`,
  textarea: `w-full rounded-md border border-gray-300 px-3 py-2 text-sm`,
  checkRow: `flex items-center gap-2 text-sm text-gray-700`,
  checkbox: `h-4 w-4 rounded border-gray-300`,
  error: `mt-2 text-sm text-red-600`,
  actions: `mt-6 flex justify-end gap-2`,
  cancelButton: `rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700`,
  saveButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
} as const;
