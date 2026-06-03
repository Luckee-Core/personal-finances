'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BANK_ACCOUNTS_PATH, CREDIT_CARDS_PATH } from '@/config/routes';
import { createTransactionThunk } from '@/store/thunks/transactions/create-transaction-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type AccountSource = 'bank' | 'credit_card';

export const CreateTransactionModal = ({ isOpen, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const bankAccounts = useAppSelector((state) => Object.values(state.bankAccounts));
  const creditCards = useAppSelector((state) => Object.values(state.creditCards));
  const categories = useAppSelector((state) => Object.values(state.categories));
  const [accountSource, setAccountSource] = useState<AccountSource>('bank');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [postedOn, setPostedOn] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const accounts =
    accountSource === 'bank'
      ? bankAccounts.map((a) => ({ id: a.id, label: a.name }))
      : creditCards.map((c) => ({ id: c.id, label: c.name }));

  const handleSubmit = async () => {
    if (!accountId) {
      setError('Select an account or card.');
      return;
    }
    setError('');
    setIsSaving(true);
    const amountCents = Math.round(Number(amount) * 100);
    const result = await dispatch(
      createTransactionThunk({
        bank_account_id: accountSource === 'bank' ? accountId : null,
        credit_card_id: accountSource === 'credit_card' ? accountId : null,
        category_id: categoryId || null,
        posted_on: postedOn,
        amount_cents: amountCents,
        description,
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
        <h2 className={styles.heading}>New transaction</h2>
        <div className={styles.fields}>
          <div className={styles.sourceRow}>
            <label className={styles.sourceLabel}>
              <input
                type="radio"
                checked={accountSource === 'bank'}
                onChange={() => {
                  setAccountSource('bank');
                  setAccountId('');
                }}
              />
              Bank account
            </label>
            <label className={styles.sourceLabel}>
              <input
                type="radio"
                checked={accountSource === 'credit_card'}
                onChange={() => {
                  setAccountSource('credit_card');
                  setAccountId('');
                }}
              />
              Credit card
            </label>
          </div>
          <select
            className={styles.input}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            <option value="">
              {accountSource === 'bank' ? 'Select bank account' : 'Select credit card'}
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          {accounts.length === 0 && (
            <p className={styles.hint}>
              {accountSource === 'bank' ? (
                <>
                  No bank accounts yet.{' '}
                  <Link href={BANK_ACCOUNTS_PATH} className={styles.hintLink}>
                    Add one
                  </Link>
                </>
              ) : (
                <>
                  No credit cards yet.{' '}
                  <Link href={CREDIT_CARDS_PATH} className={styles.hintLink}>
                    Add one
                  </Link>
                </>
              )}
            </p>
          )}
          <select
            className={styles.input}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className={styles.input}
            value={postedOn}
            onChange={(e) => setPostedOn(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount (USD)"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
  sourceRow: `
    flex flex-wrap gap-4 text-sm text-gray-700
  `,
  sourceLabel: `
    flex items-center gap-2
  `,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  hint: `
    text-sm text-gray-600
  `,
  hintLink: `
    underline
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
