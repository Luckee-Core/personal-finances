'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BANK_ACCOUNTS_PATH, CREDIT_CARDS_PATH } from '@/config/routes';
import { uploadStatementImportThunk } from '@/store/thunks/statement-imports/upload-statement-import-thunk';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type ImportSource = 'bank' | 'credit_card';

export const StatementImportUploadPanel = () => {
  const dispatch = useAppDispatch();
  const bankAccounts = useAppSelector((state) => Object.values(state.bankAccounts));
  const creditCards = useAppSelector((state) => Object.values(state.creditCards));
  const [importSource, setImportSource] = useState<ImportSource>('bank');
  const [accountId, setAccountId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const accounts =
    importSource === 'bank'
      ? bankAccounts.map((a) => ({ id: a.id, label: a.name }))
      : creditCards.map((c) => ({ id: c.id, label: c.name }));

  const handleSourceChange = (source: ImportSource) => {
    setImportSource(source);
    setAccountId('');
  };

  const handleUpload = async () => {
    if (!file || !accountId) {
      setMessage(
        importSource === 'bank'
          ? 'Select a bank account and CSV file.'
          : 'Select a credit card and CSV file.',
      );
      return;
    }
    setIsUploading(true);
    setMessage('');
    const result = await dispatch(
      uploadStatementImportThunk(file, {
        type: importSource === 'bank' ? 'bank' : 'credit_card',
        id: accountId,
      }),
    );
    setIsUploading(false);
    if (result.status !== 200 || !('data' in result)) {
      setMessage('errorMessage' in result ? result.errorMessage : 'Upload failed.');
      return;
    }
    setMessage(
      `Imported ${result.data.createdCount} rows, skipped ${result.data.skippedCount}.`,
    );
    setFile(null);
  };

  const noAccounts = accounts.length === 0;

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Upload statement CSV</h2>
      <div className={styles.sourceRow}>
        <label className={styles.sourceLabel}>
          <input
            type="radio"
            name="importSource"
            checked={importSource === 'bank'}
            onChange={() => handleSourceChange('bank')}
          />
          Bank account
        </label>
        <label className={styles.sourceLabel}>
          <input
            type="radio"
            name="importSource"
            checked={importSource === 'credit_card'}
            onChange={() => handleSourceChange('credit_card')}
          />
          Credit card
        </label>
      </div>
      <select
        className={styles.select}
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      >
        <option value="">
          {importSource === 'bank' ? 'Select bank account' : 'Select credit card'}
        </option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
      {noAccounts && (
        <p className={styles.hint}>
          {importSource === 'bank' ? (
            <>
              Add a <Link href={BANK_ACCOUNTS_PATH} className={styles.hintLink}>bank account</Link>{' '}
              first.
            </>
          ) : (
            <>
              Add a <Link href={CREDIT_CARDS_PATH} className={styles.hintLink}>credit card</Link>{' '}
              first.
            </>
          )}
        </p>
      )}
      <input
        type="file"
        accept=".csv,text/csv"
        className={styles.fileInput}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        disabled={isUploading || noAccounts}
        onClick={() => void handleUpload()}
        className={styles.uploadButton}
      >
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  panel: `rounded-lg border border-gray-200 bg-white p-5 space-y-3`,
  heading: `text-sm font-semibold text-gray-900`,
  sourceRow: `flex flex-wrap gap-4 text-sm text-gray-700`,
  sourceLabel: `flex items-center gap-2`,
  select: `w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm`,
  hint: `text-sm text-gray-600`,
  hintLink: `underline`,
  fileInput: `block text-sm text-gray-700`,
  uploadButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50`,
  message: `text-sm text-gray-600`,
} as const;
